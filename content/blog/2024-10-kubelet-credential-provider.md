+++
title = "Making OnPrem Kubernetes fell like EKS/AKS/GKE"
description = "Managed Kubernetes is awesome. No worries about the controlplane, etcd and node provisioning. But sometimes managed k8s is not an option. To get a little closer to the managed experience you could use the credential-provider-api and make all devs love you!"
date = '2024-10-28'

[taxonomies]
categories=["it"]
tags = ['Kubernetes', 'Dev', 'Go', 'DevOps']

[extra]
pic = "/img/blog/credential-manager.webp"
+++
# Improving OnPrem Kubernetes & making it feel like managed k8s

Managed Kubernetes services like AKS, EKS or GKE are awesome. The hyperscaler's take away so many annoying and difficult tasks. When you use a managed Kubernetes offering, you don't have to deal with the controlplane, no etcd backups and provisioning of new nodes is fast and painless.  
A very nice feature of these managed Kubernetes services is that you can just use the container images from your hyperscaler's container registries **without** having to create a `image-pull-secret` in every namespace and deployment. Not having to deal with this saves hours of mindless work and saves you from stupid errors that nobody wants to deal with. But how do the hyperscaler's do that? See, AWS, Azure and Google also just cook with water, it's no magic. Read on how you can make your OnPrem feel a little more like *generic-hyperscaler*.

## The kubelet-credential-provider-api
What is kubelet-credential-provider-api?  
It is a very small interface where the kubelet (the agent that runs on every kubernetes node) invokes a small program and passes a well-defined `CredentialProviderRequest` to it. The program is then expected to respond with a `CredentialProviderResponse`. This response contains the registry credentials which the kubelet then passes to the container-runtime-interface (CNI) which pulls the desired image from the target registry. This way, users can create deployments with images from password protected registries without having to specify any secrets, since the kublet just pulls them dynamically.

But how does the `credential-provider` get the registry credentials?  
That actually depends on the cloud you are on. On AWS the [ecr-credential-provider](https://cloud-provider-aws.sigs.k8s.io/credential_provider/) uses the IAM role of the ec2 node it is on and then requests a shot lived token from AWS's secret-token-services for the target registry, if the IAM policy allows it. It's pretty much the same on Azure, while their `credential-provider` is not open-source ,it is safe to assume that it uses Azures managed identities to acquire credentials for the desired registry. You can read more about it on the [Kubernetes Docs](https://kubernetes.io/docs/reference/config-api/kubelet-credentialprovider.v1/).

## How can I profit from that?
It is quite easy to implement the kubernetes `credential-provider-api` yourself. And suddenly no developer needs to provide a password anymore if they pull images for you common-internal registry or from your DockerHub mirror. Even if you use `docker.io` directly, it is easy to reach the 100 pulls per 6h pull limit. But if you use a credential-provider, the limit is immediately doubled without any work for the devs.

Since it is so easy, I did it myself. I created a the [kubelet-static-credential-provider](https://github.com/hegerdes/kubelet-static-credential-provider) which runs on every architecture that is supported by Kubernetes.
All you have to do is download the binary on every kubernetes node, create a small config and add the following arguments to your kubelet:
 * `--image-credential-provider-bin-dir=/var/lib/kubelet-plugins/`
 * `--image-credential-provider-config=/srv/kscp-conf.yaml`

The `kscp-conf.yaml` should look like this and can contain as many credential provider as you want:
```yaml
# /srv/kscp-conf.yaml
apiVersion: kubelet.config.k8s.io/v1
kind: CredentialProviderConfig
providers:
  - name: static-credential-provider
    # You can also use a config file instead of envs
    # args:[--config, <path-to-password-conf>]
    matchImages: [docker.io]
    defaultCacheDuration: "12h"
    apiVersion: credentialprovider.kubelet.k8s.io/v1
    env:
      - name: KSCP_REGISTRY_USERNAME
        value: <my-user>
      - name: KSCP_REGISTRY_PASSWORD
        value: <my-password>
  # Optional: More credential providers
```
Now I doubled my DockerHub pull limit and can use private registries without any additional work for any devs. And let me say this, they will love you for not having to deal with these secrets.

**NOTE:**  
My `static-credential-provider` is written in Go and uses the native Kubernetes types. But since it is such a simple interface, you can easily create the same functionality in a bash script when type safety is not so important. Don't believe me? I also did a bash version, check it out [here](https://github.com/hegerdes/kubelet-static-credential-provider/blob/main/hack/static-credential-provider.sh) 

## A word about security
I already hear the screaming. **THIS IS NOT Secure! This is bad practice!!1!**  
Yeah, my implementation expects credentials that are on every node in plain text. But if some attacker gains access to one of Kubernetes worker nodes you have far bigger problems to deal with. When an attacker has access to a node, he can get to the information and credentials on every container of that node. He can see all traffic and export any data on that node. Your infrastructure was compromised long before the attacker git access to the registry credentials.  
Even more important: Container images are not considered a safe place in the first place. If there is anything sensitive in your container image you are doing things wrong!

My advice is to create credentials that are read-only. So even in the case these leak, they can only be used to pull images with some application code that is to no use for anyone outside the company. It is also entirely possible to authenticate just a few registries with this method. The `matchImages` attribute allows a list of images for which the kubelet should invoke the `credential-provider`. You can even use patterns like `docker.io/company-x-common/*` in each entry to have fine control over when to use this functionally.

## Conclusion
If you have a self hosted Kubernetes cluster, this is an easy way to boos the devs productivity. It also allows pulling images from private registry in the bootstrap process when you can't use `image-pull-secrets` yes. Implementing this is quite easy. Feel free to use my `static-credential-provider` or write you own version. Even a bash script can be enough and I also provided some alternatives in the *Readme* of my implementation. You can check it out here: [kubelet-static-credential-provider](https://github.com/hegerdes/kubelet-static-credential-provider)
