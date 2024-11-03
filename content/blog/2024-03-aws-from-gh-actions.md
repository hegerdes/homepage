+++
title = "Using AWS from GitHub without Credentials"
description = "Learn how to manage less secrets and make your GitHub Actions CI/CD more secure by using identity tokens and trust relationships."
date = '2024-03-18'

[taxonomies]
categories=["it"]
tags = ['GitHub', 'AWS', 'CI/CD', 'IaC', 'Tricks']

[extra]
pic = "/img/blog/secure-id-industrial.webp"
+++
# Using AWS from GitHub without Credentials

AWS allows external services to authenticate without any secrets, which increases security and also reduces management overhead. There is no need to create, distribute, or rotate any secrets.

This short guide shows how to set up and use this federated identity concept.

## Pre-Requirements
To follow this guide, you need:
 * A GitHub repo with read/write access. We will use `my-org/demo`
 * A AWS account that can create roles.
 * This example will use [terraform](https://www.terraform.io/) for IaC deployments. Other tools or the WebUI should also work.


## Configure AWS
You need to configure your AWS account as an identity provider. This can be done via the `aws_iam_openid_connect_provider` resource or via the AWS console. To use that identity provider, you need to create a role (or use an existing one) and establish a trust relationship with that role and your GitHub repo. This can can be archived with a `iam_policy_document`. In terraform, this would look like this:

```hcl,linenos
# Get the identity provider arn
resource "aws_iam_openid_connect_provider" "github" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["1b511abead59c6ce207077c0bf0e0043b1382612"]
  url             = "https://token.actions.githubusercontent.com"
}

# Create iam trust policy with github repo
data "aws_iam_policy_document" "github_actions_assume_role" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      # GitHub identity provider
      type        = "Federated"
      identifiers = [data.aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      # CHANGE ME: Set organization to my-org and to demo
      values   = ["repo:${var.organization}/${var.git_repo_name}:*"]
    }
  }
}

# Create role and assign iam_policy_document
resource "aws_iam_role" "github_actions" {
  name               = "github-actions-${lower(var.organization)}-${lower(var.git_repo_name)}"
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role.json
  tags               = var.tags
}
```

This is all that is needed to use this identity on the AWS side. Most likely, you need additional permissions attached to your roles in order to deploy lambda functions, access S3 or push containers to ECR. Just create this polices and attach them to the role as you need.

## Configure GitHub Actions
Now we need GitHub Actions to log into AWS. For this, we create a workflow with this minimal configuration:

```yaml,linenos
name: Demo

on:
  push:
    branches: [main]

# Minimal permissions needed
permissions:
  contents: read
  id-token: write

jobs:
  build-image:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          # Your region. Can be a var or hardcoded
          aws-region: ${{ vars.AWS_REGION }}
          # Your role name you created previously
          role-to-assume: ${{ secrets.AWS_ROLE }}

      - name: S3 list
        run: aws s3 ls MY_BUCKET
```
*Note:* When you use repo secrets/vars you need to have maintainer or admin permissions for the GitHub repo. Yet, both values are not considered confidential.

Now you can run AWS commands in GitHub actions without having to set or manage any passwords or keys.
