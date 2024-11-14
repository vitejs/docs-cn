---
title: WireGuard Web UI & AdGuard Home
---

# WireGuard UI Configuration Guide {#wireguard-ui}

## Introduction {#introduction}

WireGuard UI is a web-based interface for managing WireGuard VPN server. This guide provides a complete setup with AdGuard Home integration for DNS filtering.

## Environment Variables {#environment}

Create a `.env` file in your project root:

```env
# WireGuard UI Configuration
WGUI_USERNAME=admin
WGUI_PASSWORD=your_secure_password
WGUI_ENDPOINT_ADDRESS=your_public_ip
WGUI_SERVER_PORT=51830

# Network Configuration
PRIVATE_NETWORK_SUBNET=10.2.0.0/24
WIREGUARD_IP=10.2.0.202
ADGUARD_IP=10.2.0.204
VPN_SUBNET=10.2.1.1/24

# WireGuard Server Configuration
WGUI_DNS=1.1.1.1
WIREGUARD_PORT=5000

# Email Configuration (Optional)
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM_ADDRESS=your_email@domain.com
EMAIL_FROM_NAME=WireGuard VPN

# Security
SESSION_SECRET=generate_random_secret_here

# AdGuard Configuration
ADGUARD_DNS_PORT=5553
```

## Directory Structure {#directory}

```bash
./wireguard-setup/
├── docker-compose.yml
├── .env
├── db/                     # WireGuard UI database
├── wireguard/             # WireGuard configurations
└── adguard/
    ├── opt-adguard-work/  # AdGuard working directory
    └── opt-adguard-conf/  # AdGuard configuration
```

## Docker Compose Configuration {#docker-compose}

Here's your complete `docker-compose.yml` with environment variables:

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
    container_name: wireguard
    restart: always
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
      - WGUI_MANAGE_START=true
      - WGUI_MANAGE_RESTART=true
      - WGUI_SERVER_INTERFACE_ADDRESSES=${VPN_SUBNET}
      - WGUI_DEFAULT_CLIENT_ALLOWED_IPS=0.0.0.0/0
      - WGUI_DEFAULT_CLIENT_USE_SERVER_DNS=true
      - WGUI_DEFAULT_CLIENT_ENABLE_AFTER_CREATION=true
      - WGUI_DEFAULT_CLIENT_PERSISTENT_KEEPALIVE=25
      - WGUI_DNS=${WGUI_DNS}
      - BIND_ADDRESS=0.0.0.0:${WIREGUARD_PORT}
      - WGUI_ENDPOINT_ADDRESS=${WGUI_ENDPOINT_ADDRESS}
    ports:
      - "${WIREGUARD_PORT}:${WIREGUARD_PORT}"
      - "${WGUI_SERVER_PORT}:${WGUI_SERVER_PORT}/udp"
    volumes:
      - ./db:/app/db
      - ./wireguard:/etc/wireguard
    networks:
      private_network:
        ipv4_address: ${WIREGUARD_IP}

  adguard:
    container_name: adguard
    image: adguard/adguardhome
    restart: always
    hostname: adguard
    volumes:
      - "./adguard/opt-adguard-work:/opt/adguardhome/work"
      - "./adguard/opt-adguard-conf:/opt/adguardhome/conf"
    ports:
      - "${ADGUARD_DNS_PORT}:53"
    networks:
      private_network:
        ipv4_address: ${ADGUARD_IP}
```

## Initial Setup {#initial-setup}

1. Create required directories:

```bash
mkdir -p {db,wireguard,adguard/opt-adguard-work,adguard/opt-adguard-conf}
```

2. Set proper permissions:

```bash
chmod 755 db wireguard adguard
```

3. Generate session secret:

```bash
openssl rand -base64 32
```

4. Start the services:

```bash
docker-compose up -d
```

## WireGuard UI Configuration {#wireguard-configuration}

### Server Settings {#server-settings}

Access the WireGuard UI at `http://your-server-ip:5000` and configure:

1. **Interface Settings**:
   - Post Up Script:
   ```bash
   iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
   ```
   - Post Down Script:
   ```bash
   iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
   ```

2. **Default Client Settings**:
   ```plaintext
   DNS = 10.2.0.204
   AllowedIPs = 0.0.0.0/0
   PersistentKeepalive = 25
   ```

## AdGuard Home Configuration {#adguard-configuration}

1. Access AdGuard Home setup at `http://your-server-ip:3000`

2. Initial Configuration:
   ```yaml
   bind_host: 0.0.0.0
   bind_port: 80
   auth_name: admin
   ```

3. DNS Settings:
   ```yaml
   upstream_dns:
    - 1.1.1.1
    - 1.0.0.1
   ```

## Client Configuration {#client-configuration}

### Mobile Clients

1. Generate client in WireGuard UI
2. Download configuration
3. Scan QR code with WireGuard mobile app

### Desktop Clients

1. Install WireGuard client
2. Import configuration file
3. Connect to VPN

## Firewall Configuration {#firewall}

Allow required ports on your server:

```bash
# UFW Configuration
sudo ufw allow 5000/tcp  # WireGuard UI
sudo ufw allow 51830/udp # WireGuard VPN
sudo ufw allow 5553/tcp  # AdGuard DNS
sudo ufw allow 5553/udp  # AdGuard DNS
```

## Monitoring {#monitoring}

### Log Checking

```bash
# WireGuard UI logs
docker logs wireguard

# AdGuard logs
docker logs adguard
```

### Status Checking

```bash
# Check WireGuard interface
docker exec wireguard wg show

# Check connected clients
docker exec wireguard wg show wg0
```

## Backup Configuration {#backup}

Create backup script `backup-wireguard.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backup/wireguard"
DATE=$(date +%Y%m%d)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup WireGuard configurations
tar -czf $BACKUP_DIR/wireguard-$DATE.tar.gz \
    ./db \
    ./wireguard \
    ./adguard \
    .env \
    docker-compose.yml
```

## Troubleshooting {#troubleshooting}

1. **Connection Issues**:
   ```bash
   # Check WireGuard service
   docker exec wireguard wg show
   
   # Verify network configuration
   docker exec wireguard ip a show wg0
   ```

2. **DNS Issues**:
   ```bash
   # Test AdGuard DNS
   dig @10.2.0.204 google.com
   
   # Check AdGuard logs
   docker logs adguard
   ```

## Best Practices {#best-practices}

1. **Security**:
   - Use strong passwords
   - Regularly update containers
   - Enable automatic security updates
   - Use fail2ban for protection

2. **Maintenance**:
   ```bash
   # Update containers
   docker-compose pull
   docker-compose up -d
   
   # Clean old data
   docker system prune
   ```

3. **Performance**:
   - Monitor system resources
   - Regular log rotation
   - Backup configurations

## Additional Notes {#additional-notes}

### Systemd Service

Create `/etc/systemd/system/wireguard-ui.service`:

```ini
[Unit]
Description=WireGuard UI with AdGuard
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/wireguard-ui
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down

[Install]
WantedBy=multi-user.target
```

Enable service:
```bash
sudo systemctl enable wireguard-ui
sudo systemctl start wireguard-ui
```

::: tip Important
Remember to:
1. Replace placeholder values in .env file
2. Backup configurations regularly
3. Keep systems updated
4. Monitor logs for issues
5. Use strong passwords
:::