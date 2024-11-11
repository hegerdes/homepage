+++
title = "What is new in containerd 2.0"
description = "Learn what is new in containerd 2.0 and how you can benefit from better performance and increased security. Highlights are user-namespaces and faster image decompression."
date = '2024-11-10'

[taxonomies]
categories=["it"]
tags = ['Kubernetes', 'Container', 'Linux', 'IT-Sec']

[extra]
pic = "/img/blog/containers-modern.webp"
+++
# What is new in containerd 2.0?

Containerd recently released its first major update since its 1.0 release form over 7 years ago. It provides some exciting new features, improves compatibility, gets rid of some deprecated functions and may even improve performance.  
This post aims to give a high level overview of the changes made in containerd and takes a closer look into the *user-namespaces* functionality.

---
> **_ℹ️_** Containerd is a Container-Runtime-Interface (CRI) compliant implementation that can manage the entire lifecycle of an container. It is used in Docker and most Kubernetes flavors (including AKS/EKS/GKE) to manage all container processes.
---
## How do I upgrade
The containerd project is committed to keep the upgrade path as simple as possible. Most settings should work the same as containerd `v1.7x`. When you use the deprecated `aufs` snapshotter (most likely you are not) you have to switch to a new snapshotter. Another change is that you have to explcitly re-enable the image schema V1 if you still depend on those.  
Beside that there should be little changes that require attention. To upgrade to the newer config version `v3` you can just run `containerd config migrate`.


## New functions
The [GitHub Release](https://github.com/containerd/containerd/releases/tag/v2.0.0) from containerd 2.0 gives a first overview of the changes, but does not explain the implications of each change. I piked a few highlight and will cover them in more detail:

**User-Namespaces**  
This is a big one for me and will increase security of containerized workloads by a lot!  
> Why is it impotent?

If you run a container today you can set the `UID`, the user UserID as which the main container process runs. Every single security guide regarding containers recommends to run container processes as none-root and as a unprivileged user, which IDs start at the 1000 range.  
For most applications this is not an issue, but there are certain processes that require root. If processes need to install packages they require root, CI-Jobs often require root and it is really hard to run an `ssh` server as none-root. Even one of the most used containers, `nginx`, start as root and then drop their permissions to a none privileged user. The problem with root is that if an attacker manages to escape the container sandbox he is automatically root on the host system since UserIDs in a container map one to one to the one on the host.  
User-Namespaces changes that. If you ran a container with the user-namespaces feature enabled that container can run as root, but has a different, unprivileged UserID on the host. This is a great feature that drastically improves security.  
The 2.0 release of containerd supports user-namespaces by default but you may still have to enable it in your kernel parameters with `user.max_user_namespaces=1048576` (Suggested values from CoreOS for CRI-O).  
While it is now shipped with containerd, it is still in beta for Kubernetes. Your can enable it by setting the `featureGate` `UserNamespacesSupport` to `true` on the api-server.  
To start a pod which uses user-namespaces set the `hostUsers` parameter to `false`. Thats all you need to do. This can also be enforced via admission controllers.

```yaml,linenos
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: user-namespaces-demo
  name: user-namespaces-demo
spec:
  # Enables user-namespaces
  hostUsers: false 
  containers:
  - image: nginx
    name: user-namespaces-demo
    resources: {}
```

**Intel ISA-L's igzip**  
This is a nice addition which may increase your container startup times by a few hundred millisecond. But how?  
Container images are just a bunch of gziped archives layered ontop of each other. A manifest specifies which archives belong to which image. When an image is pulled it gets transferred via HTTP over the network and has to be extracted and decompressed. Most of the time this is done via `gzip`.  
But `gzip` is single-threaded and does not use the full potential of modern processor. To overcome this there is also a multithreaded implementation of `gzip` called `pigz`. While `pigz` is faster then the default variant, `igzip` is even more performant. Acording to [benchmark by simonis](https://github.com/simonis/zlib-bench/blob/master/Results.md) `igzip` is twice as fas as `gzip`.  
If you want to profit from this improvement just install `igzip` (debian package is called `isal`), containerd automatically check which version is installed on the system and picks the most preformat one.

**Container Checkpoints**  
This is more of a debug function, but with containerd 2.0 you now can freeze an entire container at is current state, including all memory and running processes, and export it. The container now can be restored or further inspected. You can read more about this on the [criu-wiki](https://criu.org/Main_Page).

**Notable mentions**
 * The config format version changed to v3. You can migrate it with `containerd config migrate`
 * Containerd now allows container processes to bind to privileged ports by default.
 * Enables the Container-Device-Interface (CDI) by default
 * Deprecated `aufs` snapshotter was deleted

