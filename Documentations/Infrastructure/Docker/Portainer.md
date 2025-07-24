---
title: Deploying Portainer on Docker Swarm with High Availability
description: A detailed guide to deploying Portainer on Docker Swarm with high availability, including configuration, deployment, and scaling.
mermaidTheme: forest
---

# Deploying Portainer on Docker Swarm

<DifficultyIndicator 
  :difficulty="3" 
  label="Portainer on Swarm" 
  time="2-3 hours" 
  :prerequisites="['Docker', 'Docker Swarm basics', 'Network configuration knowledge']"
>
  Setting up Portainer on Docker Swarm with high availability requires understanding of container orchestration, networking, and service configuration. The complexity increases when implementing security measures and load balancing.
</DifficultyIndicator>

## Overview

Portainer is a powerful and lightweight management UI for Docker, designed to simplify the process of managing containers, images, networks, and volumes. When deploying Portainer in a **Docker Swarm** environment with high availability, it’s essential to configure services to ensure reliability, scalability, and fault tolerance. This guide outlines the complete setup, including the necessary files, deployment steps, and best practices for maintaining and scaling Portainer.

---

## Project Structure

The deployment for Portainer on Docker Swarm follows this project structure:

```
./
├── .env
├── docker-compose.yml
└── volumes/
    └── portainer/
```

### Description of Files:

- **.env**: Contains configuration variables like versioning, ports, and volume paths, allowing easy customization of the deployment.
- **docker-compose.yml**: Defines the Docker Swarm services, including Portainer, Portainer Agent, and network configuration.
- **volumes/portainer/**: A directory where Portainer’s persistent data will be stored, ensuring data is retained even if the container is restarted.

---

## Configuration Files

### Environment Variables (.env)

This file defines configuration variables, making the Docker Swarm deployment more flexible and scalable.

```env [.env]
# Portainer Configuration
PORTAINER_VERSION=latest
PORTAINER_PORT=9000
PORTAINER_EDGE_PORT=8000

# Volume Paths
PORTAINER_DATA_PATH=./volumes/portainer/data

# Network Configuration
PORTAINER_NETWORK_NAME=portainer_network

# Deployment Configuration
PORTAINER_REPLICAS=2

# SSL/TLS Configuration (optional, uncomment if SSL is required)
# SSL_CERT_PATH=./volumes/portainer/certs/fullchain.pem
# SSL_KEY_PATH=./volumes/portainer/certs/privkey.pem
```

### Docker Compose File (docker-compose.yml)

This file contains the configuration for deploying both the **Portainer** and **Portainer Agent** services in a Docker Swarm cluster.

```yaml [docker-compose.yml]
version: '3.8'

services:
  portainer:
    image: portainer/portainer-ce:${PORTAINER_VERSION:-latest}
    command: -H tcp://tasks.agent:9001 --tlsskipverify
    ports:
      - "${PORTAINER_PORT:-9000}:9000"
      - "${PORTAINER_EDGE_PORT:-8000}:8000"
    volumes:
      - ${PORTAINER_DATA_PATH:-./volumes/portainer/data}:/data
      # Uncomment below lines if using SSL
      # - ${SSL_CERT_PATH}:/certs/fullchain.pem:ro
      # - ${SSL_KEY_PATH}:/certs/privkey.pem:ro
    networks:
      - portainer
    deploy:
      mode: replicated
      replicas: ${PORTAINER_REPLICAS:-2}
      placement:
        constraints:
          - node.role == manager
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
      restart_policy:
        condition: any
        delay: 5s
        max_attempts: 3
        window: 120s
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.portainer.service=portainer"
        - "traefik.http.services.portainer.loadbalancer.server.port=9000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  agent:
    image: portainer/agent:${PORTAINER_VERSION:-latest}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
    networks:
      - portainer
    deploy:
      mode: global
      placement:
        constraints:
          - node.platform.os == linux
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
      restart_policy:
        condition: any
        delay: 5s
        max_attempts: 3
        window: 120s
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9001"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  portainer:
    driver: overlay
    attachable: true
    driver_opts:
      encrypted: "true"
```

---

## Deployment Steps

### 1. Initialize Docker Swarm

If Docker Swarm is not already initialized, you can start the manager node:

```bash
# On the manager node
docker swarm init --advertise-addr <MANAGER-IP>
```

### 2. Join Worker Nodes

On each worker node, run the following command using the token provided by the manager node during initialization:

```bash
# On worker nodes
docker swarm join --token <WORKER-TOKEN> <MANAGER-IP>:2377
```

### 3. Create Volume Directory

Create the necessary directories and set the appropriate permissions:

```bash
# Create volume directory for Portainer data
mkdir -p ./volumes/portainer/data

# Set proper permissions to the data directory
chmod 700 ./volumes/portainer/data
```

### 4. Deploy the Stack

Use the `docker-compose.yml` to deploy the stack in Swarm mode:

```bash
# Deploy Portainer stack
docker stack deploy -c docker-compose.yml portainer
```

### 5. Verify the Deployment

Check the deployment status:

```bash
# Check the stack status
docker stack ps portainer

# List running services
docker service ls

# View logs for Portainer service
docker service logs portainer_portainer
```

---

## Post-Deployment Configuration

### Accessing Portainer

Once the stack is deployed, Portainer can be accessed via the following URLs:

- **Web UI**: `http://<manager-ip>:9000` (default Portainer interface)
- **Edge Agent**: `http://<manager-ip>:8000` (for edge compute features)

### Initial Setup

1. **Create the Admin Account**: The first time you access Portainer, you will be prompted to create an admin account.
2. **Configure Docker Swarm**: Once logged in, select "Docker Swarm" as your environment to begin managing your Swarm cluster.
3. **Set Up Other Configurations**: Configure user roles, access control, and Docker environments as needed.

---

## Security Best Practices

### Enable SSL/TLS for Secure Access

To ensure secure access to Portainer, enable SSL by uncommenting the SSL configuration in both the `.env` and `docker-compose.yml` files:

```bash
# Provide the path to your SSL certificate and key
SSL_CERT_PATH=./volumes/portainer/certs/fullchain.pem
SSL_KEY_PATH=./volumes/portainer/certs/privkey.pem
```

If using a **reverse proxy** such as Traefik, you can also offload SSL termination to the reverse proxy.

### Configure Firewall Rules

To protect Portainer from unauthorized access, set up firewall rules:

```bash
# Allow access to Portainer web interface
sudo ufw allow 9000/tcp

# Allow Portainer edge compute features
sudo ufw allow 8000/tcp

# Allow Swarm communication between nodes
sudo ufw allow 2377/tcp
sudo ufw allow 7946/tcp
sudo ufw allow 7946/udp
sudo ufw allow 4789/udp
```

### Set Up Reverse Proxy

Use Traefik, Nginx, or similar reverse proxies to manage external access to Portainer with enhanced security. A reverse proxy can provide SSL termination, authentication, and routing functionality.

---

## Scaling and Maintenance

### Scaling Portainer Services

To scale Portainer and add more replicas, use the following command:

```bash
# Scale Portainer service (e.g., 3 replicas)
docker service scale portainer_portainer=3
```

### Updating Portainer

To update Portainer to the latest version, use the `docker service update` command:

```bash
# Update Portainer to the latest version
docker service update --image portainer/portainer-ce:latest portainer_portainer
```

### Backing Up Portainer Data

Regular backups of Portainer’s data volume are crucial for disaster recovery. Here's how to create a backup:

```bash
# Stop the Portainer service temporarily
docker service scale portainer_portainer=0

# Backup the data directory
tar -czf portainer-backup-$(date +%Y%m%d).tar.gz ./volumes/portainer/data

# Restart the Portainer service
docker service scale portainer_portainer=2
```

### Health Monitoring

Monitor the health of Portainer services using:

```bash
# Monitor service health status
watch docker service ls

# Check specific service logs
docker service logs portainer_portainer
docker service logs portainer_agent
```

---

## Conclusion

By following this guide, you can deploy Portainer on Docker Swarm with high availability, security, and scalability. This setup ensures that your containerized infrastructure is

 easily manageable, resilient, and accessible. 

Ensure to:
- Regularly back up Portainer data
- Monitor your services and nodes
- Scale and update your services as needed
- Implement strong security practices like SSL/TLS and firewall configurations

With Portainer in Docker Swarm, you can simplify your container management while maintaining robust security and uptime.
