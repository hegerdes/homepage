+++
title = "AWS Web-Identity to Azure - Goodbye Static Tokens"
description = "How to get rid of static tokens. Federate your AWS, CI or OnPrem Identity to Azure without having to look at a single token. Also learn how to poor man IDP"
date = '2026-06-26'

[taxonomies]
categories=["it"]
tags = ['Azure', 'AWS', 'OIDC', 'OAuth2', 'Authentication']

[extra]
pic = '/img/blog/aws-azure-oidc-federate.webp'
+++

# Native Keyless Authentication from AWS to Azure with Web-Identity

---
> **TLDR:** AWS STS Web-Identity-Token function allows secure, low maintenance authentication via OIDC for all none AWS Services at no additional cost. Perfect for Azure, OnPrem system or CI.
---

Late 2025, I wrote about [Reduce your Token-Usage for all non AWS-Apps](/blog/2025-12-aws-web-identity-token/) which looked at the new AWS capability to authenticate from AWS to OnPrem resources. But what about MultiCloud? Your DNS-Zone that is hosted on Azure or the "offsite" backups.  
No more expired credentials, no need for rotation and reduced risk of leakage.

## The Auth flow
We want to use an AWS IAM Role (EC2, Lambda, and a like) to authenticate to Azure to list our object storage: `AWS->Azure`  
But we could also start from GitLab CI, GitHub Actions or OnPrem, assume an AWS IAM Role via OIDC IDToken and move from there: `OnPrem->AWS->Azure`  
> If we wanted we cloud probably go to Google and from there back to AWS

All without a single ApiToken!

## Setup
On AWS we need to ensure web identity is enabled
```bash,linenos
# Get your issuer config
aws iam get-outbound-web-identity-federation-info --output json
# if not enabled, you can enable it with
aws iam enable-outbound-web-identity-federation --output json
```
If not already enabled, it creates a aws managed private key-pair (RSA and ECDSA) and publishes the IdP-Config under a globally accessible and unique endpoint. The command then gives you an URL in the format `https://xxx.tokens.sts.global.api.aws`.  
When you access `https://xxx.tokens.sts.global.api.aws/.well-known/openid-configuration` you can see all supported claims, supported signature algorithms and the path to your JWKs config, which contains all information to validate your JWTs with it's associated public key.

Now we need an IAM Role with these permission. If you don't have them crate a policy and attach to your role.

```json,linenos
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sts:TagGetWebIdentityToken",
        "sts:GetWebIdentityToken",
        "sts:SetContext"
      ],
      "Resource": "*"
    }
  ]
}
```

> **Note:** You can also add `Condition` to the permissions to ensure a low TTL, the  algorithm or tag validation. You also need at least the AWS-CLI version `≥2.32.5`

Now every IAM-Role with these permissions can crate a JWT:
```bash,linenos
aws sts get-web-identity-token --audience api://AzureADTokenExchange
# You can also add up to 50 tags which will make extra information available in the JWT
aws sts get-web-identity-token --audience api://AzureADTokenExchange --tags Key=account,Value=123456
```

The decoded JWT will look like this:
```json,linenos
{
  "aud": "api://AzureADTokenExchange",
  "sub": "<MY_IAM_ROLE_ARN>",
  "https://sts.amazonaws.com/": {
    "org_id": "o-xxx",
    "aws_account": "123456",
    "ou_path": ["xxx"],
    "request_tags": {
      "account": "123456"
    },
    "original_session_exp": "2025-12-07T22:17:32Z",
    "source_region": "eu-central-1",
    "principal_id": "<MY_IAM_ROLE_ARN>",
    "identity_store_user_id": "xxx"
  },
  "iss": "https://xxx.tokens.sts.global.api.aws",
  "exp": 1765140780,
  "iat": 1765140480,
  "jti": "xxx"
}
```

Now we will need the Azure side. Since the Azure UI is a ever changing mess, I will use Terraform/OpenTofu:
```hcl,linenos
data "azurerm_client_config" "current" {}
data "azurerm_resource_group" "demo" {
  name = "DevPlayground"
}

# Create the EntraID App (OAuth App)
resource "azuread_application" "demo" {
  display_name            = "EntraID App Demo"
  owners                  = [data.azuread_client_config.current.object_id]
  sign_in_audience        = "AzureADMyOrg"
  group_membership_claims = ["All"]

  api {
    requested_access_token_version = 2
  }

  app_role {
    allowed_member_types = ["Application"]
    description          = "Demo"
    display_name         = "Demo"
    enabled              = true
    id                   = "0429cbc4-e650-4306-a277-88c98179e698"
    value                = "Demo"
  }
}

# Ensure a service principal exists for that role
resource "azuread_service_principal" "demo" {
  client_id    = azuread_application.demo.client_id
  use_existing = true
}

# Assign reader to your service principle for your resource group
resource "azurerm_role_assignment" "demo" {
  scope                = data.azurerm_resource_group.demo.id
  role_definition_name = "Reader"
  principal_id         = azuread_service_principal.demo.object_id
}

# Trust relationship between aws and azure
resource "azuread_application_federated_identity_credential" "aws_static_demo" {
  application_id = azuread_application.demo.id
  display_name   = "aws-sts-webid-static"
  description    = "WebIdentity from aws"
  audiences      = ["api://AzureADTokenExchange"]
  issuer         = "https://xxx.tokens.sts.global.api.aws"
  subject        = "arn:aws:iam::xxx:role/aws-reserved/sso.amazonaws.com/eu-central-1/MY-Role"
}

output "clientID" {
  value = azuread_application.demo.client_id
}

output "tenantID" {
  value = data.azurerm_client_config.current.tenant_id
}

# Advanced claim validation - currently in preview and buggy
# resource "azuread_application_flexible_federated_identity_credential" "aws_flex_demo" {
#   application_id             = azuread_application.demo.id
#   display_name               = "aws-sts-webid-flex"
#   description                = "WebIdentity from aws"
#   audience                   = "api://AzureADTokenExchange"
#   issuer                     = "https://xxx.tokens.sts.global.api.aws"
#   claims_matching_expression = "claims['sub'] eq 'arn:aws:iam::xxx:role/MY-Role'"
# }
```
> **Note:** The flexible federation validation was requested in 2022 and now has a [GitHub Issue](https://github.com/Azure/azure-workload-identity/issues/373) with over 250 comments. While now in preview, it still seems to have problems with self hosted GitLab's or other none Microsoft issuer. AWS Supports this feature for years with their *Trust Federation IAM Policy* and their `"Condition": {"StringEquals": {"gitlab.com:user_login": "hegerdes"}}` blocks.  
> MS is quiet behind on this.

## Token Exchange
We now can test the trust relationship first with curl, then with the `az` cli:
```bash,linenos
# Get AWS Token
export MY_AWS_WEB_ID_TOKEN=$(aws sts get-web-identity-token \
--audience api://AzureADTokenExchange \
--signing-algorithm RS256 \
--duration-seconds 300 | jq -r .WebIdentityToken)

# Results in a new access token that is valid for azure
curl -L "https://login.microsoftonline.com/<YOUR_TENANT_ID>/oauth2/v2.0/token" \
--header "Content-Type: application/x-www-form-urlencoded" \
--data-urlencode "client_id=<YOUR_CLIENT_ID>" \
--data-urlencode "scope=https://graph.microsoft.com/.default" \
--data-urlencode "grant_type=client_credentials" \
--data-urlencode "client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer" \
--data-urlencode "client_assertion=${MY_AWS_WEB_ID_TOKEN}"

# Or sign in to az directly
az login --service-principal \
--username <YOUR_CLIENT_ID> \
--tenant <YOUR_TENANT_ID> \
--federated-token ${MY_AWS_WEB_ID_TOKEN}

# Your current id
az account show
```
## Looking Beyond AWS and Azure  

This should already work with SDKs that support auth via service principles. And all this is **not** tailored to AWS. You can use your own IDP like Keycloak or Kanidm. You do not even need a server or a backend for OIDC. The used signed JWTs are based on asymmetric encryption. All you need is a static website that hosts two files. One with `.well-known/openid-configuration` and a second one that is referenced in the first pointing to your JSON-Web-Key (`jwks`), the public keys to verify the JWT.  

I host my serverless IDP for local automation at [sts.hegerdes.com](https://sts.hegerdes.com), which is backed by a Cloudflace R2-Bucket. In the bucket is only `.well-known/openid-configuration` doc and my public keys. Only I have the private keys on my machine. I create an JWT, sign it and use it to assume an AWS IAM role or an Azure SP. No interactive auth required.  
Simple, short lived auth without managing tokens by hand!
