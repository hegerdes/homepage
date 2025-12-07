+++
title = "AWS Web-Identity-Token - The free IDP for all your OnPrem solutions"
description = "AWS created a new service which can be used to validate requests form aws in none AWS hosted infrastructure at no additional cost. It creates a managed OIDC-Issuer which can be used by anything that supports OIDC"
date = '2025-12-08'

[taxonomies]
categories=["it"]
tags = ['Kubernetes', 'AWS', 'OIDC', 'OAuth2', 'Authentication']

[extra]
pic = '/img/blog/aws-sts-web-token.webp'
+++

# Reduce your Token-Usage for all non AWS-Apps with AWS Web-Identity-Token

---
> **TLDR:** AWS new STS Web-Identity-Token function allows secure, low maintenance authentication via OIDC for all none AWS Services at no additional cost. Perfect for OnPrem system or CI.
---

AWS enabled a new functionality within their secret-token-service (STS) which basically is a free and managed [OpenID Connect](OpenID_Connect) (OIDC) Identity-Provider (IDP).  
Users and IAM-Roles with the needed permissions can create shot lived [JWTs](https://en.wikipedia.org/wiki/JSON_Web_Token) and can securely authenticate against any service that supports OIDC-Token authentication. Services can validate the token via the AWS managed IDP-Issuer. This essentially makes all long lived and manually managed credentials unneeded.


## Use cases
I found this functionality via a [post from Piotr Pabis](https://dev.to/aws-builders/aws-iam-outbound-oidc-with-google-cloud-identity-pool-5ak7). He implemented a (little over-engendered) demo to create a low maintenance authentication setup between AWS and GCP using AWS Web-Identity-Tokens, to show how to create multi-cloud secure auth setups with short lived tokens.  
This inspired me to test it out and try to access my private Kubernetes Cluster with AWS-Tokens, but the use cases are virtually endless! Just to give a few examples:

### Kubernetes
If you have a hybrid infrastructure with some systems on AWS and some OnPrem this can come very handy. Kubernetes natively supports OIDC and all you need to enable AWS Web-Identity-Token authentication is to add the AWS managed IdP to your Kubernetes [structured-auth-config](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#configuring-the-api-server).

```yaml,linenos
# Docs: https://kubernetes.io/docs/reference/access-authn-authz/authentication/#openid-connect-tokens
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
jwt:
  - issuer:
      url: https://xxx.tokens.sts.global.api.aws
      audiences:
        - https://k8s.my-org.com
    claimMappings:
      username:
        claim: sub
        prefix: "aws:"
```

> **Note:** You can add as many Issuers as you want, you can also configure and limit anonymous auth to [increase your Kubernetes security](/blog/2025-05-k8s-annonymus-auth/)

Now you can use normal Kubernetes RBAC to allow the `aws:<YOUR_ROLE_ARN>` user to access the needed resources.  
No need to ever share a `Kubeconf.yaml` ever again. Combine this approach with the [credential less authentication between GitHub Actions or GitLab CI](/blog/2024-03-aws-from-gh-actions/) and gone are the days of managing long lived credentials, rotating them and risking leakage just to deploy something to Kubernetes.

### Workflow Automation
You use automated Workflow? Have any WebHooks or have Microsoft Power Automate setup? Now everything that is accessible can have low maintenance short lived token that can easily be verified via the aws managed IdP. Need some examples?

 * Your AWS Lambda has an issue and you want it to automatically open a ticket in your support system? The lambda can use its own identity to create a token which the ticket system can validate.
 * Access an OnPrem file Share via HTTP. Just send the JWT as a Bearer, validate it and access internal documents to be processed in your AWS automation.
 * One AWS Lambda can authenticate to another without Cognito.
 * You CI assumes an AWS role and sends an authenticated request to your chat app to push notifications.
 * Update any OnPrem hosted document without pushing it to AWS.


## How to use
So how do I start using this?

Easy, just enable it and you can start requesting tokens. Everything else is managed by AWS. You can just the `aws cli` to request tokens, but also the SDK of *your favorite* language. Examples can be found at the [AWS Python boto3 docs](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/sts/client/get_web_identity_token.html).

```bash,linenos
# Get your issuer config
aws iam get-outbound-web-identity-federation-info --output json
# if not enabled, you can enable it with
aws iam enable-outbound-web-identity-federation --output json
```
If not already enabled, it creates a aws managed private key-pair (RSA and ECDSA) and publishes the IdP-Config under a globally accessible and unique endpoint. The command then gives you an URL in the format `https://xxx.tokens.sts.global.api.aws`.  
When you access `https://xxx.tokens.sts.global.api.aws/.well-known/openid-configuration` you can see all supported claims, supported signature algorithms and the path to your JWKs config, which contains all information to validate your JWTs with it's associated public key.

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

> **Note:** You can also add `Condition` to the permissions to ensure a low TTL, the used signer algorithm or any validation on tags you can think of. You also need at least the AWS-CLI version `≥2.32.5`

Now every IAM-Role with these permissions can crate a JWT:
```bash,linenos
aws sts get-web-identity-token --audience demo --signing-algorithm ES384
# You can also add up to 50 tags which will make extra information available in the JWT
aws sts get-web-identity-token --audience demo --signing-algorithm ES384 --tags Key=account,Value=123456
```

The decoded JWT will look like this:
```json,linenos
{
  "aud": "demo",
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

For testing purposes or if you have self developed applications to you want to use with AWS web-identity-tokens yo can use the example python script below to validate the token.

<details>
  <summary>validate.py</summary>

```python,linenos
import requests
import jwt

def verifyToken(
    token: str,
    jwks: dict,
    audience: str,
    issuer: str,
    algorithms = ["RS256", "ES384"]
) -> dict:
    try:
        return jwt.decode(
            token, jwks, algorithms=algorithms, audience=audience, issuer=issuer
        )
    except Exception as e:
        print("Token verification failed:", e)
        return None


def getJWKs(jwks_uri: str) -> dict:
    resp = requests.get(jwks_uri)
    resp.raise_for_status()
    return resp.json()

def getJWKsUri(issuer: str) -> str:
    resp = requests.get(f"{issuer}/.well-known/openid-configuration")
    resp.raise_for_status()
    return resp.json()["jwks_uri"]


if __name__ == "__main__":
    iss = "https://xxx.tokens.sts.global.api.aws"
    aud = "demo"
    token = "xxx"
    verifyToken(token, getJWKs(getJWKsUri(iss))["keys"][0], aud, iss)
```

</details>
