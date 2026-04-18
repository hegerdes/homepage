+++
title = "Native IPv6 Kubernetes for true edge routing"
description = "An opinionated look at running Kubernetes on IPv6, from basic cluster setups to fully routed edge architectures. It will make your networking easier and cheaper in the long run."
date = '2026-04-22'

[taxonomies]
categories=["it"]
tags = ['Kubernetes', 'DevOps', 'IPv6', 'Hetzner Cloud']

[extra]
pic = '/img/blog/k8s-native-ipv6.webp'
+++

# Kubernetes & IPv6
Let's bring some technologies with very different adoption metrics closer together:  
Kubernetes is just over 11 years old, as of writing. IPv6 is from 1998, that's more than twice the age of k8s with 27 years. Some early deployments are even older.

While Kubernetes is nothing but a success story, IPv6 has a *complicated* history. Based on [Google data](https://www.google.com/intl/en/ipv6/statistics.html?yzh=28197), IPv6 just hit 50% of traffic - after almost 30 years. Let's change that because it will make all our lives easier in the long run. Because IPv6 is the replacement of a legacy protocol - not an extension!

One of the major advantages of IPv6 is the much larger address space of 2^128 compared to 2^32. Instead of handing out individual IPs to each host or even sharing them behind (C)NAT, ISPs and cloud provider usually hand out entire ranges. Typically ranges between `/56` and `/64` are advertised. This means that every one of these prefixes has more IPs available then the entire IPv4 space.

Let's have some fun with that in Kubernetes!

## An easy IPv6 setup in Kubernetes
Kubernetes has supported IPv6 since `v1.6`, but the usability heavily depends on the CNI. The easiest way to use IPv6 in Kubernetes is to set these two args on cluster initialization with:  
`kubeadm init --pod-network-cidr=fe80:10:32::/56 --service-cidr=fe80:10:64::/112`

This example uses link-local IPv6 addresses and does not need any special network requirements. Functionally it is equivalent to IPv4 clusters. These settings and the configured CNI will create an overlay network where pods can reach each other directly via the link-local addresses, but IP packets from and to the Internet need to be rewritten to reach anything. Nothing is really simplified here since we still distinguish between "private" and "public" IPs. Nevertheless, this is a great approach for testing and dev environments with tools like minikube, kind and more.

### Native Routing
Since IPv6 allows anyone to get large, unique global address spaces, we should use them:  
`kubeadm init --pod-network-cidr=2a01:10:32::/56 --service-cidr=2a01:34:e393::/112`

It uses global unicast addresses (GUA) that were allocated to you by your ISP or cloud provider. This setup requires a little more planning. We need our own IPv6 prefix that is large enough and not used by other devices. By default, Kubernetes tries to allocate a `/64` from the pod network IPv6 CIDR to each node. In my opinion that is a very large default and wasteful, since we will never have 2^64 pods on one node. It can be changed by setting `--node-cidr-mask-size-ipv6` accordingly. Depending on your requirements, I would set a value between `/96` and `/112`. Even a `/112` would allow 2^16=65536 IPs for each node to be consumed by pods.  
Exactly the same cidr-mask-arg can be used when you don't have a `/56` IPv6 prefix or do not want to allocate the entire range to a single cluster. Service CIDRs can also be adjusted according to ones need.

Due to this approach being tailored to the current environment it runs in, it is a little less flexible, BUT it allows much simpler routing. As long as you don't have any firewalls configured and all addresses are correctly advertised, every pod can directly reach the internet and can be reached from the internet. No service, loadbalancer, proxy or NAT required. Flat, native and efficient networking.

### Native Routing on the edge
From the network perspective, the routing became simpler, but it needs proper planning and requires you to have one large CIDR allocated to you. Sometimes this is not the case. Kubernetes is designed for distributed workloads. Maybe you want a multi-region cluster, a cluster spanning between clouds and a cluster that includes edge devices. Now every location has their own distinct address prefixes.  
Here IPv6 really shines. Kubernetes at its core does not really care about IPs. We can have scattered CIDRs per node, since the routing is handled by the CNI anyway, not Kubernetes. The only thing that is preventing us from doing this by default is the `node-ipam-controller` in the `kube-controller-manager` - which can be turned off.  
Now the `pod-network-cidr` does not matter. The cluster initializes and CNI can handles the IP allocation, either via BGP or "manually" by patching each node's `.spec.podCIDR` and `.spec.podCIDRs` fields. Now we can have a cluster with one node on AWS, one on GCP, Azure and one running at your home - with all pods communicating natively over IPv6.


## A few notes about Kubernetes IPv6
Within the Kubernetes network and the IPv6 Internet, all of the above approaches work without problems. Unfortunately, not everything is IPv6 and we still have to deal with legacy IPv4. The best and easiest way to deal with that is to use [DNS64](https://datatracker.ietf.org/doc/html/rfc6147) at the CoreDNS upstream level. DNS64 essentially provides AAAA records for domains that do not have any natively by appending the target's IPv4 A address to a predefined IPv6 prefix. The resulting address will point to an [NAT64](https://datatracker.ietf.org/doc/html/rfc6146) implementation, which will handle IPv6 to IPv4 translation.  
While starting, there is no need to build this on your own, there are public and free DNS64/NAT64 services available.

Since we are already building clusters how they will be run in the future, we needed to alter some Kubernetes default configurations. The same most likely applies to your CNI. I used Cilium for all my setups, some of the configuration changes includes turning off IPv4, setting the routing mode and using kube-proxy replacement.

Native IPv6 routing simplifies the networking drastically but also exposes your workloads directly to the Internet if all addresses are correctly advertised and there is no filtering; a firewall is essential. Cilium provides great tooling for protecting the node, cluster and individual pods.

> A word about DualStack:  
> One may ask: Why just not use IPv4 and IPv6 in the cluster and workloads would use whatever works - no need for NAT64/DNS64
>
> DONT
>
> You will have two network stacks, loose native routing, have services that by default are SingleStack and apps that bind to the wrong IPs. Trust me, I tried it. You will not have less problems but double - IPv4 is legacy. There is a reason AWS EKS does not offer this configuration.


## Encouragement - try it
While this all can sound a little complex at the beginning, it has become quite simple. Resources on the web are getting more numerous, and ISPs and clouds improved their IPv6 adoption a lot (except GitHub). I used Hetzner a lot for testing, they give you a free `/64` for each node. Scaleway is also a good option. If you’re curious, you can also try to reverse engineer EKS and reimplement it, like I did - they are not doing anything magical.  
If native IPv6 is, for whatever reason, not possible, please at least create a loadbalancer that has IPv4 and IPv6. Internally all traffic can still be IPv4, but everyone on the Internet can talk to you over a modern connection without the need for DNS64/NAT64.

Regarding the different adoption rates, I have a thesis:
Kubernetes is something "new", it solved a new and unsolved problem and had big names carrying it. IPv6 aims to fix issues from a previous solution that still *kind of works*. Unfortunately, it is often cheaper to find workarounds for old solutions instead of investing in new ones. But with the increasing price for IPv4 addresses, this finally seems to change.

I hope I was able to give you a high-level overview and some approaches on how to bring IPv6 to the 90% traffic mark. Feel free to write me via [Mastodon](https://mastodon.social/@hegerdes) or the [Kubernetes Slack](https://kubernetes.slack.com/team/U05C4U2T5AA) if you have any questions. I implemented all of the above approaches and even automated most of them completely - it's not that hard :)
