+++
title = "Level up your Ansible Code - Creating Golden Images"
description = "Ansible is a good start to automate recurring tasks, but it is slow. In combination with other IaC tools you can make your infrastructure truly reproducible and even provision faster."
date = '2025-04-20'

[taxonomies]
categories=["it"]
tags = ['Automation', 'Packer', 'IaC', 'DevOps']

[extra]
pic = '/img/blog/packer-ansible.webp'
+++

# Level up your Ansible Code - Creating Golden Images

---
> **_TL;DR:_** The combination of Ansible and Packer can be a terrific solution to improve provisioning time, increase reliability and reduce stress on other infrastructure. Run Packer once with your existing Ansible-Config and reuse the resulting image a 1000 times.
---
So the story usually looks like this: You became tired of doing the same web-server base configuration over and over again. Sometimes it didn't work because you misspelled a parameter or copy-pasted the wrong command. But then someone mentioned Ansible. A tool that can run the same actions over and over again with the desired same output (when done right - which I have seen not that often). It can be lunched against 1000s of machines. It sounded great since you wanted to have more free time and are not afraid to automate yourself out of your job (don't worry, will not happen - you will only level up).  
So you started to implement your tasks as Ansible roles and tasks. It took a while to get right but now you have made yourself a name by always delivering setups in such a quick time with rock solid and consistent quality. Great, enjoy your life, right?

Yeah, maybe. But you seek even better outputs, even more "free" time, got a new requirement, or just want a good reason for your next raise? I don't really care, but this is where this canticle comes in handy!

## My Ansible setup
My story actually looked quite similar. I use Ansible to set up vanilla k8s cluster on systems. I have a `common` role for all nodes and a `cp-bootstrap`/`worker-join` role. Setting up a Debian based cluster, with a lot of extra conf for extra container-runtimes and newer kernels it takes about 15min to fully bootstrap a cluster on the Hetzner cloud. That is *so slow*.  

## The annoying stuff in Ansible
Manly because Ansible is slow. Even with [connection-pipelining](https://docs.ansible.com/ansible/latest/reference_appendices/config.html#ansible-pipelining), [multiple forks](https://docs.ansible.com/ansible/latest/reference_appendices/config.html#default-forks) and other tweaks. It gets even worse if the connection goes over VPS,JumpHosts or some Proxies. But not only Ansible is slow. Installing packages is slow, setting kernel parameters and downloading stuff is slow. And sometimes, not often, your playbooks **FAIL**. Because a connection timed out, you got rate limited or a package version changed.

When this happens, your playbooks are not idempotent, let alone reproducible. It mostly works out, but you can not guarantee that the state will always be exactly the same when you run your playbook over and over again. I get it, reproducibility is hard, but we can make your life's a little easier when we don't have to run Ansible that often. And even save more time, because again, Ansible is *slow*.

## Introducing Packer & Golden Images
Packer is a packaging software from HashiCorp. It uses plugins to integrate with various providers, such as AWS, Azure, GCE but also onPrem solutions like VMware, Proxmox and good old QEMU. It uses HashiCorp's Configuration Language (HCL), just like Terraform.  
In Packer you usually have one or more `source` resources with one or more `build` steps. Packers plugin ecosystem makes it really versatile for your build configuration. You can create AMIs on AWS, but also Docker-Images, ISOs and RAW disk images. Reusability is provided by HCL by the usage of variables, inputs and basic logic functions (JSON-Encode, reverse, map, etc.) build into HCL.  
With Packer you can archive real reproducibility. You create a working image **once** and reuse it a 1000 times. All machines created from this image will have the same, known good base configuration with the same packages installed. Perfect for providing ready-to-go hardened servers. The resulting images are called *golden-images*.  
And now we will use our existing configuration automation code for Ansible with the Packers plugin system to cut down provisioning time for our k8s clusters.

## Merging Packer & Ansible
Let's work through reusing my existing Ansible playbooks to create golden images by using an concrete example. I want to cut down provisioning time for k8s clusters from 15 minutes to 5 minutes.  
For this I will use golden images created by Packer with the the Hetzner `hcloud` Packer plugin. I need a source and some basic inputs to make it configurable:

```hcl,linenos
# hcloud.pkr.hcl
packer {
  required_plugins {
    hcloud = {
      source  = "github.com/hetznercloud/hcloud"
      version = ">= 1.6.0"
    }
  }
}

variable "base_image" {
  type    = string
  default = "debian-12"
}
variable "k8s_version" {
  type    = string
  default = "1.32.3"
}
variable "user_data_path" {
  type    = string
  default = "cloud-init.yml"
}

locals {
  output_name = "debian-12-k8s-v${var.k8s_version}"
}

source "hcloud" "k8s-amd64" {
  image         = var.base_image
  location      = "nbg1"
  server_type   = "cx22"
  ssh_keys      = []
  user_data     = file(var.user_data_path)
  ssh_username  = "root"
  snapshot_name = "${local.output_name}-amd64"
  snapshot_labels = {
    type    = "infra",
    base    = var.base_image,
    version = "${var.k8s_version}",
    name    = "${local.output_name}-amd64"
    arch    = "amd64"
  }
}
source "hcloud" "k8s-arm64" {
  image         = var.base_image
  location      = "nbg1"
  server_type   = "cax11"
  ssh_keys      = []
  user_data     = file(var.user_data_path)
  ssh_username  = "root"
  snapshot_name = "${local.output_name}-arm64"
  snapshot_labels = {
    type    = "infra",
    base    = var.base_image,
    version = "${var.k8s_version}",
    name    = "${local.output_name}-arm64"
    arch    = "arm64"
  }
}
```

This allows me to create images (or snapshots for Hetzner) for debian based imaged on amd64 and arm64. The image name will be set based on the input parameters.

Now we need a build step. While Packer has a dedicated Ansible plugin, I choose to not use it, since it did not meet my requirements for handling restarts and other parameters. Instead I choose to use the build-in `shell` provisioner which just runs some inline commands that are a predefined in a shell script:

```hcl,linenos
build {
  sources = ["source.hcloud.k8s-amd64", "source.hcloud.k8s-arm64"]

  provisioner "shell" {
    expect_disconnect = true
    env = {
      k8s_version = "${var.k8s_version}"
    }
    scripts = [
      "ansible-setup.sh",
    ]
  }
  provisioner "shell" {
    pause_before = "30s"
    max_retries = 1
    env = {
      k8s_version = "${var.k8s_version}"
    }
    scripts = [
      "ansible-setup.sh",
    ]
  }
}
```

This runs the same shell script two times, which is exactly what I need because my IaC code includes a restart to swap the current kernel version. All what my shell script really does is to wait for `cloud-init` to finish, clone my Ansible git repo and run it with a bunch of predefined vars. Finally it performs some cleanups and resets cloud-init:


```bash,linenos
#!/bin/bash
set -e -o pipefail

echo "Waiting for cloud-init to finish..."
cloud-init status --wait

# setup requirements
echo "Installing packages..."
apt-get update -qq
apt-get install -qq --yes --no-install-recommends git python3-pip
pip3 install --user --break-system-packages --no-warn-script-location --no-cache-dir ansible jmespath
PATH=~/.local/bin:$PATH

if [ ! -d "playbooks" ]; then
  git clone --depth 1 https://github.com/hegerdes/ansible-playbooks.git playbooks
fi

# setup ansible play
echo "Running playbook..."
cd playbooks
echo "Vars:"
cat <<EOF >hostvars.yaml
k8s_cri: crun
k8s_containerd_variant: github
k8s_ensure_min_kernel_version: 6.12.*
EOF

printenv | sed 's/=/\: /g' | grep k8s >>hostvars.yaml
cat hostvars.yaml

cat <<EOF >pb_k8s_local.yml
- name: K8s-ClusterPrep
  hosts: localhost
  become: true
  gather_facts: true
  roles:
    - k8s/common
EOF

# Run playbook
ansible-playbook pb_k8s_local.yml --extra-vars "@hostvars.yaml" -v && cd
```

I just run my existing playbooks locally on the target server to archive the desired configuration. While the reproducibility is provided by the resulting image, we should still try to make our playbooks idempotent, so we can run them over and over again. It should not perform any changes when the desired state is already reached.  
With this and some additional cleanup code to minimize image size, I get ready to use golden k8s images, which I can use to quickly spin up a new cluster or use as an autoscaling nodes. Every dependency I need is already in that image. Every kernel parameter is already tuned to my desire. I can just use these, and be sure that they will always act the same, since these are truly reproducible.

![Screenshot of the Hetzner image Snapshot page, showing two Debian images for amd64 and arm64, each with a size of less then 500MB](/img/blog/hetzner-debian-packer.webp)

The creation of these two images took about 12 minutes. Thats 12 minutes I have to spent once (for every k8s version) and I now save for every deployment. When I now want to create a new k8s cluster, I can just uses these images and be sure they are already configured to my desire. Bootstrapping a new cluster with these images takes actually less then 5 minutes. It saves time and I am much more constable, that my setups are always acting the same, because they are reproducible.

---
> ℹ️ You can find the complete code on my GitHub in my [GitOps](https://github.com/hegerdes/GitOps/tree/main/infra/hcloud-packer-debian) repo.
---

## Conclusion
Ansible, Packer and even Terraform are great tools that work together and ma a real dream team when put together. Thats one of the reason RedHat bought HashiCorp and now works on putting these even closer together. These tools are **not** competitors!  
When you want to save even more time, you can easily glue your Ansible code together with tools like Packer, to create truly reproducible deployments.
