---
title: Kubernetes Cluster Setup
description: A comprehensive guide to setting up a production-ready Kubernetes cluster
---

# Kubernetes Cluster Setup

<DifficultyIndicator 
  :difficulty="4" 
  label="Kubernetes Setup" 
  time="1-3 days" 
  :prerequisites="['Linux administration', 'Networking basics', 'Container concepts', 'Infrastructure automation']"
>
  Setting up a production-ready Kubernetes cluster involves multiple components, networking configuration, and security considerations. The process becomes more complex when implementing high availability and advanced features.
</DifficultyIndicator>

## Introduction

This guide walks through the process of setting up a production-ready Kubernetes cluster with considerations for security, high availability, and scalability.

## Architecture Planning

Before installation, consider:
- Cluster size and scaling requirements
- Node types (control plane vs worker nodes)
- Networking model
- Storage requirements
- Security requirements

## Installation Methods

::: code-group
```bash [kubeadm]
# Install dependencies
apt-get update && apt-get install -y apt-transport-https ca-certificates curl

# Add Kubernetes repository
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" > /etc/apt/sources.list.d/kubernetes.list
apt-get update

# Install kubeadm, kubelet, and kubectl
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl

# Initialize the cluster
kubeadm init --pod-network-cidr=192.168.0.0/16

# Set up kubeconfig
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
```

```bash [kops]
# Install kops
curl -Lo kops https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-linux-amd64
chmod +x kops
sudo mv kops /usr/local/bin/kops

# Create cluster
kops create cluster --name=kubernetes.example.com --state=s3://kops-state-bucket --zones=us-west-2a --node-count=2 --node-size=t2.medium --master-size=t2.medium --dns-zone=kubernetes.example.com

# Apply configuration
kops update cluster --name kubernetes.example.com --state=s3://kops-state-bucket --yes
```

```bash [kubespray]
# Clone Kubespray
git clone https://github.com/kubernetes-sigs/kubespray.git
cd kubespray

# Install dependencies
pip install -r requirements.txt

# Copy inventory template
cp -rfp inventory/sample inventory/mycluster

# Configure inventory
declare -a IPS=(10.10.1.3 10.10.1.4 10.10.1.5)
CONFIG_FILE=inventory/mycluster/hosts.yaml python3 contrib/inventory_builder/inventory.py ${IPS[@]}

# Deploy cluster
ansible-playbook -i inventory/mycluster/hosts.yaml --become --become-user=root cluster.yml
```
:::

## Networking Setup

Implement a CNI plugin:

```bash
# Calico installation
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

# Verify pods are running
kubectl get pods -n kube-system
```

## Security Configuration

Essential security measures:

1. RBAC configuration
2. Network policies
3. Pod security standards
4. Encryption at rest
5. Audit logging

## High Availability

For production clusters, implement:

- Multiple control plane nodes
- Etcd cluster with at least 3 nodes
- Load balancer for API server
- Proper backup strategy

## Post-Installation Verification

```bash
# Verify nodes
kubectl get nodes

# Verify core components
kubectl get pods -n kube-system

# Run a test deployment
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=NodePort
```

## Troubleshooting

Common issues and solutions:

- Network connectivity problems
- Certificate issues
- Node status issues
- Pod scheduling failures
