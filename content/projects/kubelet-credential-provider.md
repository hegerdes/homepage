+++
title = "Kubelet static credential provider | Go"
description = "Credentialless image pulls like EKS/AKS/GKE"
[taxonomies]
categories=[]
tags = []

[extra]
pic = "/img/blog/kubelet-minimal.webp"
pic_alt="Minimalistic kube icon in tan colors"
link_source="https://github.com/hegerdes/kubelet-static-credential-provider"

+++
Secrets in Kubernetes are namespaced. When using private registries you have to create a pull-secret in every namespace and reference it in each deployment. This is a poor developer experience.  
The static [credential provider plugin api](https://kubernetes.io/docs/reference/config-api/kubelet-credentialprovider.v1/) for the kubelet changes that and allows to pull images from protected registries without having developers worry about it. It allows for seamless integration just like in EKS/AKS/GCE and their hosted registries.
