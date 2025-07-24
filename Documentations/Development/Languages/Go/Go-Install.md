---
title: Installing Go
description: A comprehensive guide to installing the Go programming language on various platforms
---

# Installing Go {#installing-go}

This guide provides step-by-step instructions for installing Go on different operating systems. Go (also known as Golang) is an open-source programming language designed for simplicity, reliability, and efficiency.

## Official Download {#official-download}

The official Go installation packages can be downloaded from the [Go Downloads page](https://golang.org/dl/).

## Installing on Linux {#linux-installation}

### Using Package Manager {#linux-package-manager}

::: code-group
```bash [Debian/Ubuntu]
# Update package index
sudo apt update

# Install Go
sudo apt install golang

# Verify installation
go version
```

```bash [RHEL/CentOS]
# Install Go
sudo yum install golang

# Verify installation
go version
```

```bash [Fedora]
# Install Go
sudo dnf install golang

# Verify installation
go version
```
:::

### Manual Installation (Linux) {#linux-manual}

For the latest version or when package managers offer outdated versions:

```bash
# Download the latest version (adjust version number as needed)
wget https://golang.org/dl/go1.21.0.linux-amd64.tar.gz

# Extract the archive to /usr/local
sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz

# Set up environment variables in .profile or .bashrc
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.profile
echo 'export GOPATH=$HOME/go' >> ~/.profile
echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.profile

# Apply changes
source ~/.profile

# Verify installation
go version
```

## Installing on macOS {#macos-installation}

::: code-group
```bash [Homebrew]
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Go
brew install go

# Verify installation
go version
```

```bash [Official Installer]
# After downloading the .pkg file from golang.org/dl/
# Open the package file and follow the installation prompts
# Verify installation
go version
```
:::

## Installing on Windows {#windows-installation}

::: code-group
```powershell [MSI Installer]
# After downloading and running the MSI installer:
# Open Command Prompt or PowerShell to verify installation:
go version
```

```powershell [Chocolatey]
# Install Go
choco install golang

# Verify installation
go version
```

```powershell [Scoop]
# Install Scoop if not already installed
# iex (new-object net.webclient).downloadstring('https://get.scoop.sh')

# Install Go
scoop install go

# Verify installation
go version
```
:::

## Setting Up Your Go Workspace {#workspace-setup}

After installing Go, it's recommended to set up your workspace:

::: code-group
```bash [Linux/macOS]
# Create the workspace directories
mkdir -p $HOME/go/{bin,src,pkg}

# Ensure environment variables are set
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

```powershell [Windows]
# Create the workspace directories
mkdir -p $HOME/go/bin,$HOME/go/src,$HOME/go/pkg

# Set environment variables (can also be done through System Properties)
$env:GOPATH = "$HOME\go"
$env:PATH += ";$env:GOPATH\bin"
```
:::

## Verifying Installation {#verify-installation}

To verify that Go is properly installed, create a simple "Hello, World!" program:

```bash
# Create a directory for your first program
mkdir -p $HOME/go/src/hello
cd $HOME/go/src/hello

# Create a hello.go file
echo 'package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}' > hello.go

# Run the program
go run hello.go
```

You should see the output: `Hello, Go!`

## Upgrading Go {#upgrading-go}

To upgrade Go to a newer version, download the latest version and replace the existing installation. Your Go programs and workspace will remain intact.

::: tip
For package manager installations, use the update command for your package manager:
:::

::: code-group
```bash [apt]
sudo apt update
sudo apt upgrade golang
```

```bash [yum]
sudo yum update golang
```

```bash [dnf]
sudo dnf upgrade golang
```

```bash [Homebrew]
brew upgrade go
```

```powershell [Chocolatey]
choco upgrade golang
```
:::

## Troubleshooting {#troubleshooting}

### Common Issues {#common-issues}

1. **"go: command not found"** - Ensure Go is properly installed and your PATH includes the Go binary directory.

2. **Environment variable issues** - Verify GOPATH and PATH are correctly set:

```bash
# Check Go environment
go env

# Check PATH
echo $PATH
```

3. **Permission issues** - Ensure you have proper permissions for the Go installation directory.

::: warning
If you're installing Go system-wide, you may need administrator/root privileges.
:::

4. **Outdated version** - If you need a newer version, follow the upgrade instructions above.

## Development Environment {#dev-environment}

::: tip
For a consistent development environment, consider using Docker:
:::

```bash
# Run a Go development container
docker run -it --name go-dev -v $(pwd):/app -w /app golang:latest bash
```

## Next Steps {#next-steps}

Now that Go is installed, you're ready to start learning and developing with Go. Check out our [Go Basics](/Documentations/Development/Languages/Go/Go-Basics) guide to begin your journey with Go programming.
