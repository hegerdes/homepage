+++
title = "Follow Up: Let's talk about anonymous access to Kubernetes"
description = "Rory McCune posted a great article about Kubernetes default enabled anonymous-auth setting. But it can't always be disabled, nevertheless k8s evolves fast and now offers more granular control."
date = '2025-05-22'

[taxonomies]
categories=["it"]
tags = ['Kubernetes', 'Security', 'Authentication']

[extra]
pic = '/img/blog/k8s-anonymous-auth.webp'
+++

# Follow Up: Let's talk about anonymous access to Kubernetes

---
> **_TL;DR:_** Kubernetes default anonymous-auth allows unended information exposure, but disabling it was hard. Now you can limit anonymous-auth to specific paths only.
---
In 2023 Rory McCune (raesene) wrote a [nice blog](https://raesene.github.io/blog/2023/03/18/lets-talk-about-anonymous-access-to-Kubernetes/) post about Kubernetes `anonymous-auth` flag, which is enabled by default. While security mechanism like RBAC are still applied, certain endpoints in Kubernetes can be accessed without providing any form of authentication - therefore, it is called `anonymous-auth`.  
He raised awareness for this flag but also did a regular [Kubernetes Census](https://raesene.github.io/blog/2024/02/17/a-final-kubernetes-censys/) listing how many Kubernetes API-Servers were publicly accessible and in which version. He was able to gather that date, because the `/version` path in one of the paths that can be accessed without any form of authentication.

![Graph of public accessible Kubernetes Servers and their version](https://raesene.github.io/assets/media/kubernetes-versions-2024.png)

Rory McCune suggests to outright disable the anonyms auth flag with `--anonymous-auth=false` to reduce the information exposed and reduce the potential attack vector. While it is definitely a smart idea, it is often unpractical since `kubeadm` needs certain anonymous-auth endpoints in order to join new nodes to a cluster.  
In long-lived static clusters where new nodes are rarely added, this would not be a large issue, but the kube-api-server itself uses some anonymous-auth endpoints in order to perform health checks on itself.  
If these checks failed, due to a `401 Unauthorized` HTTP Error, the api-server would mark itself (actually it is the kubelet doing the check) as unhealthy and restart itself, over and over again. Making the whole cluster unaccessible.

So setting `--anonymous-auth=false` often was impractical.  
But Kubernetes is a fast-moving platform and has heavily increased security in recent years with features like `usernamespaces`, `appamor`, `selinux` and bound-serviceaccount-tokens. They also introduced the [structured-authentication-config](https://kubernetes.io/blog/2024/04/25/structured-authentication-moves-to-beta/). A config file that allows users to declaratively configure OIDC-Auth (the only reasonable auth option for user access in larger clusters) **AND** a fine-grained anonymous auth configuration.

It took me a few tries but with this authentication-config you can drastically reduce the information exposure of your cluster and still be able to join new nodes via `kubeadm` and check the cluster health.

```yaml,linenos
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
anonymous:
  enabled: true
  conditions:
    # kubeadm needs to read the discovery info
    - path: /api/v1/namespaces/kube-public/configmaps/cluster-info
    # for liveness and readiness checks:
    - path: /healthz
    - path: /readyz
    - path: /livez
jwt:
  # Optional OIDC config
```

This only gives access to the health and ready endpoints and to one specific configmap. The cluster-version and other information are not accessible without authentication.  
The health endpoints only return `200 OK` and the configmap contains the IDs of bootstrap-token and the clusters CA certificate, which is accessible anyway.

Thats it! Easy way to protect your clusters a little more without sacrificing functionality.

> P.S. If someone knows how to write CEL expressions that can validate the extra claims of a user idtoken - write me!
