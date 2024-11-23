---
layout: doc
title: WireGuard UI Installation Learning Guide
description: A comprehensive learning guide for WireGuard UI setup with Docker and AdGuard integration
mermaidTheme: forest
---

# WireGuard UI with AdGuard - Learning Guide

## Introduction

This guide explains how to set up a WireGuard VPN server with a web UI and AdGuard DNS integration using Docker. It's designed as a learning resource to understand container networking and VPN configuration.

::: tip Learning Objectives
After completing this guide, you will understand:
- Docker networking concepts
- WireGuard VPN configuration
- DNS management with AdGuard
- Security best practices
:::

## Prerequisites

Before starting, ensure you have:
- Linux server (Ubuntu 20.04+ recommended)
- Docker and Docker Compose installed
- Basic networking knowledge
- Access to ports:
  - 5000 (WireGuard UI)
  - 51830 (WireGuard VPN)
  - 5553 (AdGuard DNS)

## Initial Setup

### Directory Structure

Create your project structure:

```bash
mkdir -p ~/wireguard-setup/{db,wireguard,adguard}
mkdir -p ~/wireguard-setup/adguard/{opt-adguard-work,opt-adguard-conf}
cd ~/wireguard-setup
```

### Environment Configuration

Create `.env` file:

```bash
# Network Configuration
PRIVATE_NETWORK_SUBNET=10.2.0.0/24
WIREGUARD_UI_IP=10.2.0.202
ADGUARD_IP=10.2.0.204

# WireGuard UI Settings
WGUI_USERNAME=admin           # Change this
WGUI_PASSWORD=SecurePass123   # Change this
WGUI_SERVER_INTERFACE_ADDRESSES=10.2.1.1/24
WGUI_ENDPOINT_ADDRESS=your.public.ip.address
WGUI_DNS=1.1.1.1
BIND_ADDRESS=0.0.0.0:5000

# WireGuard Client Settings
WGUI_DEFAULT_CLIENT_ALLOWED_IPS=0.0.0.0/0
WGUI_DEFAULT_CLIENT_USE_SERVER_DNS=true
WGUI_DEFAULT_CLIENT_ENABLE_AFTER_CREATION=true
WGUI_DEFAULT_CLIENT_PERSISTENT_KEEPALIVE=25

# Management Settings
WGUI_MANAGE_START=true
WGUI_MANAGE_RESTART=true

# Optional Email Configuration
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM_ADDRESS=your@email.com
EMAIL_FROM_NAME=VPN_Admin
SESSION_SECRET=generate_random_secret_here
```

### Docker Compose Configuration

Create `docker-compose.yml`:

```yaml
version: '3.8'

networks:
  private_network:
    ipam:
      driver: default
      config:
        - subnet: ${PRIVATE_NETWORK_SUBNET}

services:
  wireguard-ui:
    image: ngoduykhanh/wireguard-ui:latest
    restart: always
    container_name: wireguard
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    sysctls:
      net.ipv4.ip_forward: '1'
      net.ipv4.conf.all.src_valid_mark: '1'
    environment:
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}
      - EMAIL_FROM_ADDRESS=${EMAIL_FROM_ADDRESS}
      - EMAIL_FROM_NAME=${EMAIL_FROM_NAME}
      - SESSION_SECRET=${SESSION_SECRET}
      - WGUI_USERNAME=${WGUI_USERNAME}
      - WGUI_PASSWORD=${WGUI_PASSWORD}
      - WGUI_MANAGE_START=${WGUI_MANAGE_START}
      - WGUI_MANAGE_RESTART=${WGUI_MANAGE_RESTART}
      - WGUI_SERVER_INTERFACE_ADDRESSES=${WGUI_SERVER_INTERFACE_ADDRESSES}
      - WGUI_DEFAULT_CLIENT_ALLOWED_IPS=${WGUI_DEFAULT_CLIENT_ALLOWED_IPS}
      - WGUI_DEFAULT_CLIENT_USE_SERVER_DNS=${WGUI_DEFAULT_CLIENT_USE_SERVER_DNS}
      - WGUI_DEFAULT_CLIENT_ENABLE_AFTER_CREATION=${WGUI_DEFAULT_CLIENT_ENABLE_AFTER_CREATION}
      - WGUI_DEFAULT_CLIENT_PERSISTENT_KEEPALIVE=${WGUI_DEFAULT_CLIENT_PERSISTENT_KEEPALIVE}
      - WGUI_DNS=${WGUI_DNS}
      - BIND_ADDRESS=${BIND_ADDRESS}
      - WGUI_ENDPOINT_ADDRESS=${WGUI_ENDPOINT_ADDRESS}
    ports:
      - "5000:5000"
      - "51830:51830/udp"
    volumes:
      - ./db:/app/db
      - ./wireguard:/etc/wireguard
    networks:
      private_network:
        ipv4_address: ${WIREGUARD_UI_IP}

  adguard:
    container_name: adguard
    image: adguard/adguardhome
    restart: always
    hostname: adguard
    volumes:
      - "./adguard/opt-adguard-work:/opt/adguardhome/work"
      - "./adguard/opt-adguard-conf:/opt/adguardhome/conf"
    ports:
      - "5553:53"
    networks:
      private_network:
        ipv4_address: ${ADGUARD_IP}
```

## Installation Steps

### 1. System Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y \
    docker.io \
    docker-compose \
    wireguard \
    iptables
```

### 2. Network Configuration

Set up system networking parameters:

```bash
# Create sysctl configuration
sudo tee /etc/sysctl.d/99-wireguard.conf << EOF
net.ipv4.ip_forward = 1
net.ipv4.conf.all.src_valid_mark = 1
EOF

# Apply settings
sudo sysctl -p /etc/sysctl.d/99-wireguard.conf
```

### 3. Firewall Configuration

```bash
# Configure UFW
sudo ufw allow 5000/tcp      # WireGuard UI
sudo ufw allow 51830/udp     # WireGuard VPN
sudo ufw allow 5553/udp      # AdGuard DNS
```

### 4. Launch Services

```bash
# Start containers
docker-compose up -d

# Verify status
docker-compose ps
```

## Configuration Guide

### WireGuard UI Setup

1. Access the UI at `http://your-server-ip:5000`
2. Log in with credentials from `.env`
3. Configure server interface:
   - Interface name: `wg0`
   - Listen port: `51830`
   - Addresses: `10.2.1.1/24`

### AdGuard Configuration

1. Access AdGuard at `http://your-server-ip:5553`
2. Complete initial setup:
   - Set admin credentials
   - Configure DNS settings
   - Enable ad blocking features

## Client Management

### Adding New Clients

1. In WireGuard UI:
   - Click "Add Client"
   - Set client name
   - Configure allowed IPs
   - Enable client

2. Client Configuration:
   - Download config file
   - Import into WireGuard client
   - Test connection

::: tip Client Settings
Default client configuration:
- DNS: `1.1.1.1`
- Allowed IPs: `0.0.0.0/0`
- Keep-alive: 25 seconds
:::

## Security Considerations

::: warning Important Security Notes
1. Change default credentials
2. Use strong passwords
3. Limit access to management ports
4. Regular security updates
5. Monitor access logs
:::

## Troubleshooting

### Common Issues

1. Connection Problems:
```bash
# Check container status
docker-compose ps
docker-compose logs wireguard-ui
```

2. DNS Issues:
```bash
# Verify AdGuard
docker-compose logs adguard
```

3. Permission Problems:
```bash
# Fix volume permissions
sudo chown -R root:root ./wireguard
sudo chmod -R 600 ./wireguard
```

## Maintenance

### Backup Process

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR
cp -r {db,wireguard,adguard} .env docker-compose.yml $BACKUP_DIR/
EOF
chmod +x backup.sh
```

### Updates

```bash
# Update containers
docker-compose pull
docker-compose up -d
```

## Learning Resources

::: tip Additional Learning
- [WireGuard Documentation](https://www.wireguard.com/quickstart/)
- [Docker Networking Guide](https://docs.docker.com/network/)
- [AdGuard DNS Documentation](https://adguard.com/en/adguard-dns/overview.html)
:::

## Environment Variables Reference

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| WGUI_ENDPOINT_ADDRESS | Public IP/hostname | - | Server's public IP |
| WGUI_SERVER_INTERFACE_ADDRESSES | VPN subnet | 10.2.1.1/24 | Internal VPN network |
| WGUI_MANAGE_START | Auto-start WireGuard | true | Service management |
| WGUI_MANAGE_RESTART | Auto-restart WireGuard | true | Service management |
| PERSISTENT_KEEPALIVE | Keep-alive interval | 25 | In seconds |
| SESSION_SECRET | UI session secret | - | Random string |
| SENDGRID_API_KEY | Email API key | - | Optional |
| EMAIL_FROM_ADDRESS | Sender email | - | Optional |
| EMAIL_FROM_NAME | Sender name | - | Optional |

## Advanced Network Configuration

### MTU Optimization

Add to your `.env`:

```bash
# Network Performance
WG_MTU=1420                    # Optimal for most networks
WG_KEEPALIVE=25               # Connection persistence
WG_FWMARK=0x51820            # Packet marking
WG_TX_QUEUE_LENGTH=1000      # Transmission queue
```

### Quality of Service (QoS)

Create `qos-setup.sh`:

```bash
#!/bin/bash

# QoS configuration for WireGuard
IFACE="wg0"
UPLINK="1000mbit"  # Adjust to your bandwidth
DOWNLINK="1000mbit"

# Apply QoS rules
tc qdisc add dev $IFACE root handle 1: htb default 10
tc class add dev $IFACE parent 1: classid 1:1 htb rate $UPLINK burst 15k

# Priority classes
tc class add dev $IFACE parent 1:1 classid 1:10 htb rate 500mbit ceil $UPLINK burst 15k
tc class add dev $IFACE parent 1:1 classid 1:20 htb rate 400mbit ceil $UPLINK burst 15k
tc class add dev $IFACE parent 1:1 classid 1:30 htb rate 100mbit ceil $UPLINK burst 15k

# Apply FQ_CODEL for smart queue management
tc qdisc add dev $IFACE parent 1:10 handle 10: fq_codel
tc qdisc add dev $IFACE parent 1:20 handle 20: fq_codel
tc qdisc add dev $IFACE parent 1:30 handle 30: fq_codel
```

## Monitoring Setup

### Prometheus Integration

Create `prometheus/wireguard.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'wireguard'
    static_configs:
      - targets: ['localhost:9586']
    metrics_path: '/metrics'

  - job_name: 'adguard'
    static_configs:
      - targets: ['adguard:80']
    metrics_path: '/metrics'
```

### Grafana Dashboard

Create `grafana/dashboards/wireguard.json`:

```json
{
  "annotations": {
    "list": []
  },
  "panels": [
    {
      "title": "Active Connections",
      "type": "stat",
      "datasource": "Prometheus",
      "targets": [
        {
          "expr": "wireguard_peer_count"
        }
      ]
    },
    {
      "title": "Traffic Overview",
      "type": "graph",
      "datasource": "Prometheus",
      "targets": [
        {
          "expr": "rate(wireguard_received_bytes_total[5m])",
          "legend": "Received"
        },
        {
          "expr": "rate(wireguard_sent_bytes_total[5m])",
          "legend": "Sent"
        }
      ]
    }
  ]
}
```

## Advanced Security Configuration

### SSH Hardening

Create `ssh-hardening.sh`:

```bash
#!/bin/bash

# Backup original configuration
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Apply security settings
cat << EOF > /etc/ssh/sshd_config
Port 22
Protocol 2
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PermitEmptyPasswords no
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers your_username
EOF

# Restart SSH service
systemctl restart sshd
```

### Fail2ban Configuration

Create `fail2ban/jail.local`:

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[wireguard]
enabled = true
port = 51830
protocol = udp
filter = wireguard
logpath = /var/log/wireguard.log
maxretry = 3
bantime = 3600

[wireguard-ui]
enabled = true
port = 5000
protocol = tcp
filter = wireguard-ui
logpath = /var/log/wireguard-ui.log
maxretry = 5
bantime = 7200
```

## Performance Tuning

### System Limits

Add to `/etc/security/limits.conf`:

```bash
# Increase system limits
*       soft    nofile      1048576
*       hard    nofile      1048576
*       soft    nproc       unlimited
*       hard    nproc       unlimited
```

### Network Stack Optimization

Add to `/etc/sysctl.d/99-network-performance.conf`:

```bash
# TCP optimizations
net.core.rmem_max = 67108864
net.core.wmem_max = 67108864
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 87380 67108864
net.ipv4.tcp_congestion_control = bbr
net.core.default_qdisc = fq

# UDP optimizations for WireGuard
net.core.netdev_max_backlog = 16384
net.core.somaxconn = 8192
```

## Backup and Recovery

### Automated Backup Script

Create `backup-wireguard.sh`:

```bash
#!/bin/bash

# Configuration
BACKUP_ROOT="/backup/wireguard"
BACKUP_DIR="${BACKUP_ROOT}/$(date +%Y%m%d_%H%M%S)"
RETENTION_DAYS=30

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup configurations
cp -r db/ "$BACKUP_DIR/db"
cp -r wireguard/ "$BACKUP_DIR/wireguard"
cp -r adguard/ "$BACKUP_DIR/adguard"
cp .env docker-compose.yml "$BACKUP_DIR/"

# Compress backup
tar czf "${BACKUP_DIR}.tar.gz" -C "$BACKUP_DIR" .

# Cleanup old backups
find "$BACKUP_ROOT" -type d -mtime +$RETENTION_DAYS -exec rm -rf {} \;
```

### Recovery Procedure

Create `restore-wireguard.sh`:

```bash
#!/bin/bash

# Usage: ./restore-wireguard.sh /path/to/backup.tar.gz

if [ -z "$1" ]; then
    echo "Usage: $0 /path/to/backup.tar.gz"
    exit 1
fi

BACKUP_FILE="$1"
RESTORE_DIR="restore_$(date +%Y%m%d_%H%M%S)"

# Stop services
docker-compose down

# Create restore directory
mkdir -p "$RESTORE_DIR"

# Extract backup
tar xzf "$BACKUP_FILE" -C "$RESTORE_DIR"

# Restore configurations
cp -r "$RESTORE_DIR/db" .
cp -r "$RESTORE_DIR/wireguard" .
cp -r "$RESTORE_DIR/adguard" .
cp "$RESTORE_DIR/.env" .
cp "$RESTORE_DIR/docker-compose.yml" .

# Restart services
docker-compose up -d

# Cleanup
rm -rf "$RESTORE_DIR"
```

## Best Practices

::: tip Production Deployment
1. Regular Security Maintenance
   - Update systems weekly
   - Rotate encryption keys monthly
   - Review access logs daily
   - Test backups regularly

2. Performance Monitoring
   - Set up alerts for high resource usage
   - Monitor connection quality
   - Track bandwidth usage
   - Check error rates

3. Documentation
   - Maintain configuration changelog
   - Document custom scripts
   - Keep network diagrams updated
   - Record troubleshooting procedures
:::

::: warning Critical Reminders
- Never expose management ports to the internet
- Regularly update SSL certificates
- Monitor for unusual traffic patterns
- Keep backups in secure, off-site location
- Test disaster recovery procedures
:::

## Advanced Troubleshooting

### Network Diagnostics

Create `diagnose-network.sh`:

```bash
#!/bin/bash

echo "WireGuard Network Diagnostics"
echo "============================"

# Check WireGuard interface
ip link show wg0

# Display routing table
ip route show table all

# Check connection tracking
conntrack -L

# Display network statistics
ss -s

# Check DNS resolution
dig @${WGUI_DNS} google.com

# Test network performance
iperf3 -c ${WGUI_ENDPOINT_ADDRESS}
```

This completes the comprehensive guide for setting up and maintaining a WireGuard VPN server with UI and AdGuard integration. The combination of basic setup, advanced configuration, monitoring, and maintenance procedures provides a complete learning resource for managing a production VPN service.