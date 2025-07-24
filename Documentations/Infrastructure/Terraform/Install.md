---
title: Installation
description: Installation of Terraform on Linux, macOS, Windows, and via Docker.
mermaidTheme: forest
---

# Terraform Installation Guide

Terraform is an open-source Infrastructure as Code (IaC) tool that enables you to safely and predictably create, change, and improve infrastructure. This guide covers installing Terraform on various platforms and using Docker for a portable development environment.

## Prerequisites

- Basic command-line knowledge
- Administrative privileges on your system

## Installation Methods

### 1. Native Installation

#### Linux

::: code-group
```sh [apt]
sudo apt update
sudo apt install -y wget unzip
wget https://releases.hashicorp.com/terraform/1.7.5/terraform_1.7.5_linux_amd64.zip
unzip terraform_1.7.5_linux_amd64.zip
sudo mv terraform /usr/local/bin/
terraform -v
```
```sh [yum]
sudo yum install -y wget unzip
wget https://releases.hashicorp.com/terraform/1.7.5/terraform_1.7.5_linux_amd64.zip
unzip terraform_1.7.5_linux_amd64.zip
sudo mv terraform /usr/local/bin/
terraform -v
```
```sh [dnf]
sudo dnf install -y wget unzip
wget https://releases.hashicorp.com/terraform/1.7.5/terraform_1.7.5_linux_amd64.zip
unzip terraform_1.7.5_linux_amd64.zip
sudo mv terraform /usr/local/bin/
terraform -v
```
:::

#### macOS

::: code-group
```sh [Homebrew]
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform -v
```
:::

#### Windows

::: code-group
```powershell [Chocolatey]
choco install terraform
terraform -v
```
:::

::: tip
Always verify the downloaded binary's checksum for security.
:::

### 2. Docker-based Development Environment

Using Docker ensures a consistent and isolated environment for Terraform development.

#### Run Terraform in Docker

::: code-group
```sh [Linux/macOS]
docker run --rm -it -v $(pwd):/workspace -w /workspace hashicorp/terraform:1.7.5 init
```
```powershell [Windows]
docker run --rm -it -v %cd%:/workspace -w /workspace hashicorp/terraform:1.7.5 init
```
:::

::: tip
Using Docker is recommended for development and CI/CD pipelines to avoid polluting your host system.
:::

## Verify Installation

Run the following command to verify Terraform is installed:

```sh
terraform -v
```

You should see output similar to:

```
Terraform v1.7.5
```

## Next Steps

- [Configuration](./Configuration.md): Learn how to configure Terraform for your projects.
- [Official Documentation](https://developer.hashicorp.com/terraform/docs)

::: tip
For advanced users, consider managing Terraform versions with [tfenv](https://github.com/tfutils/tfenv).
:::
