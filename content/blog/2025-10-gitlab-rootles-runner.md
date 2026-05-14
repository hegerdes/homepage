+++
title = "Rootless GitLab Runners"
description = "Learn how to run any GitLab CI Job without giving anything root. Even dind. No Workload changes required!"
date = '2025-10-05'

[taxonomies]
categories=["it"]
tags = ['GitLab', 'Security', 'Linux', 'CI/CD', 'Container']

[extra]
pic = '/img/blog/rootless-gitlab-runner.webp'
+++

# Rootless GitLab Runners

---
> **_TL;DR:_** Rootless Docker has become easy! You can also easily run the GitLab Runner binary with rootless Docker without impacting workloads with rootless-kit. Even run buildkit, dind and docker build! See the HOW-TO!
---

GitLab CI is the biggest CI/CD system after GitHub Actions and is the preferred solution for self-hosted and enterprise SCM-Systems. While GitHub gives you a fresh, full-blown VM for each job, GitLab has the concept of different *Executors*. While the GitLab-Runner binary manages the communication and job setup, the executor does the actual work.

While there are `Shell` and `SSH` executors, container-based executors are often preferred for flexibility, security and reproducibility. While Docker *can* improve security, it is not know for it in its default configuration, since everything runs as root.

## Attack Surface Docker
By default, Docker is started as root and everyone in the `docker` user group can communicate with the root-owned socket in `/var/run/docker.sock`. Since the user-ids inside a container map 1:1 to the user-ids on the host, a simple `docker run --it --privileged -v /:/host debian` can overtake the whole system. Even if the user executing it is not root.

> ℹ️ Docker and other containers are **NOT** virtualization! All processes run on the same kernel as the host and are only isolated by process namespace and cgroup capabilities.

This alone is kind of bad. It gets even worse if you run arbitrary, potentially malicious code from unknown systems. A complete host takeover is only one `services: [docker:dind]` or a [stupid runner config](https://java.testcontainers.org/supported_docker_environment/continuous_integration/gitlab_ci/#example-using-docker-socket) away.

But how can you run jobs rootless and what about `docker build` jobs that need dind?

## Securing Docker & CI
This can be mitigated by not running Docker as root at all. Rootless Docker used to be a pain but has become surprisingly easy on modern systems.

**NOTE:** The instructions are based on a Debian system but can be adapted to others.

First install Docker according to the official docs:
```bash,linenos
# Install pre-requirements and some extra packages
sudo apt update
sudo apt install curl ca-certificates curl uidmap apparmor lsb-release \
    slirp4netns dbus-user-session fuse-overlayfs systemd-container fuse-overlayfs cifs-utils

# Add the docker apt repo
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
    https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Finally install docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
```

Now Docker is running as root. Which we don't want. Disable it via systemd and optionally allow normal users to open ports below 1024.
```bash,linenos
# Disable the root docker service
sudo systemctl restart apparmor.service
sudo systemctl disable --now docker.service docker.socket
sudo rm /var/run/docker.sock
# Allow privileged ports for normal users
sudo sysctl -w net.ipv4.ip_unprivileged_port_start=0
```

Now we need the gitlab-runner binary that communicates with GitLab and our executor. By default, the official install scripts also runs gitlab-runner as root. It should also run as a normal user:

```bash,linenos
# Create gitlab-runner user and install the GitLab Runner
sudo useradd --create-home --shell /usr/bin/bash --user-group gitlab-runner
curl -JOL https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh 
sudo bash script.deb.sh
sudo apt install gitlab-runner
sudo systemctl stop gitlab-runner
sudo systemctl disable --now gitlab-runner
```

We want to run docker rootless, but the users inside of containers are often root or require root. Since we want all our workloads to work with the new setup we use the *user-namespace* capability of the Linux kernel. This maps the root user form inside a container to an unprivileged user to the host. So even if an attacker manages to break out of a container, he will never have privileges higher than the newly created `gitlab-runner` user.

```bash,linenos
# Set user-namespace mapping
sudo echo $(id -u gitlab-runner):100000:65536 >> /etc/subuid
sudo echo $(id -u gitlab-runner):100000:65536 >> /etc/subgid

# If you run everything headless without a login shell you need to enable lingering
sudo loginctl enable-linger
```

We can now switch to the new `gitlab-runner` user and set up docker and the required configs:

<details>
  <summary><i>gitlab-runner.service</i></summary>

```toml,linenos
# gitlab-runner.service
[Unit]
Description="GitLab Runner"
ConditionFileIsExecutable="/usr/bin/gitlab-runner"
After="network.target"

[Service]
Restart="always"
RestartSec=120
StartLimitInterval=5
StartLimitBurst=10
Environment="DOCKER_HOST=unix:///run/user/<<YOUR_GITLAB_RUNNER_USERID>>/docker.sock"
ExecStart=/usr/bin/gitlab-runner run \
--config /home/gitlab-runner/gitlab-runner-config.toml \
--working-directory /home/gitlab-runner \
--service gitlab-runner --user gitlab-runner

[Install]
WantedBy="default.target"
```
</details>
<details>
  <summary><i>gitlab-runner-config.toml</i></summary>

```toml,linenos
# gitlab-runner-config.toml
concurrent = 4
check_interval = 0
shutdown_timeout = 0
[session_server]
  session_timeout = 1800
[[runners]]
  name = "Rootless Docker"
  url = "https://gitlab.com"
  id = 1234
  token = "<MY_TOKEN>"
  executor = "docker"
  [runners.docker]
    image = "debian"
    allowed_pull_policies = ["always", "if-not-present"]
    allowed_privileged_images = ["moby/buildkit:*", "docker:dind" ]
    disable_entrypoint_overwrite = false
    privileged = true
    oom_kill_disable = false
    disable_cache = false
    volumes = ["/cache", "/certs/client"]
    shm_size = 0
    network_mtu = 0
```
</details>

We now can start rootless docker and configure gitlab-runner to use it:
```bash,linenos
sudo -i && su gitlab-runner
mkdir -p .config/systemd/user /.config/docker

# Run rootless docker
dockerd-rootless-setuptool.sh install

# You can now run docker commands
export DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock
docker run --rm hello-world

# Setup GitLab Runner conf and systemd service with the conf above 
# Remember to adjust your user-id and set your token
vim .config/systemd/user/gitlab-runner.service
vim gitlab-runner-config.toml

# Activate the runner
systemctl --user daemon-reload
systemctl --user enable gitlab-runner.service
systemctl --user start gitlab-runner.service
```

With the correct token and GitLab server configured you should now see the runner in the GitLab UI.  
You now can run any CI-Job with this runner - even dind works!

```yaml,linenos
rootless-job:
  tags: [my-rootless-runner]
  services: [docker:dind]
  stage: test
  scripts:
    - echo "I am running as $(whoami)"
```

## What about Kubernetes
What if you use the Kubernetes GitLab-Executor and run buildkit in Kubernetes?  
When you run modern Kubernetes with `containerd` version `>=2.x1` and Kubernetes `>= 1.33.x` you can use `userNamespace` with your pods. It is just one parameter. Just set `spec.hostUsers` to `false` in your `Pods` any thats it.


## And now?
This is one measurement to avoid security issues that may overtake your CI runners, but it is by far not the only attack that often used. Supply chain security is a wide and deep topic and the upcoming post will explain how to protect your environment from credential threats and other attacks.
