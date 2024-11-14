---
title: WireGuard Web UI & AdGuard Home
---

# Advanced WireGuard UI & AdGuard Technical Guide {#advanced-guide}

## Prerequisites {#prerequisites}

### System Requirements {#system-requirements}

Base system: Ubuntu 20.04 LTS or newer

### Package Installation {#package-installation}

Update system and install core packages:

    sudo apt update
    sudo apt install -y wireguard wireguard-tools iptables fail2ban ufw tcpdump net-tools qrencode

Install monitoring tools:

    sudo apt install -y prometheus-node-exporter unattended-upgrades nethogs iftop nload vnstat

Install security tools:

    sudo apt install -y snort lynis auditd acl rsyslog logrotate

## VPN Architecture Overview {#vpn-architecture}

### WireGuard Protocol {#wireguard-protocol}

WireGuard operates on these key principles:

1. **Cryptographic Primitives**:
   - ChaCha20 for symmetric encryption
   - Poly1305 for authentication
   - Curve25519 for ECDH
   - BLAKE2s for hashing
   - SipHash24 for hashtable keys
   - HKDF for key derivation

2. **Performance Characteristics**:
   - Minimal attack surface (~4,000 LOC)
   - Constant-time operations
   - Memory-safe implementation
   - Kernel-space implementation

## Multi-Layer Security Architecture {#security-architecture}

### OSI Layer Security Implementation {#osi-security}

| Layer | Components | Security Measures |
|-------|------------|------------------|
| L7 Application | AdGuard, WG-UI | Authentication, DNS filtering |
| L6 Presentation | WireGuard | Encryption (ChaCha20) |
| L5 Session | WireGuard | Key exchange, session management |
| L4 Transport | UDP/TCP | Port filtering, rate limiting |
| L3 Network | IP | Network segmentation, firewalling |
| L2 Data Link | Interface | MAC filtering (optional) |
| L1 Physical | Hardware | Physical security |

### Security Tools Matrix {#security-tools}

| Category | Tool | Purpose | Implementation |
|----------|------|---------|----------------|
| Firewall | UFW/iptables | Network filtering | Dynamic rules |
| IDS/IPS | Snort | Traffic inspection | Signature-based |
| Access Control | Fail2ban | Brute force prevention | Ban mechanisms |
| Monitoring | Prometheus | Metrics collection | Real-time data |
| Audit | Auditd | System auditing | Log analysis |
| DNS Security | AdGuard | DNS filtering | DoT/DoH |

### Network Zone Segmentation {#network-zones}

| Zone | CIDR | Purpose | Security Level |
|------|------|---------|---------------|
| Management | 10.2.0.0/24 | Admin access | Highest |
| User VPN | 10.2.1.0/24 | Client connections | Medium |
| Services | 10.2.2.0/24 | Internal applications | High |
| DMZ | 10.2.3.0/24 | Public services | Restricted |

### Security Checklist {#security-checklist}

Network Security:
- ⬜ Interface hardening
- ⬜ Network isolation
- ⬜ Traffic monitoring
- ⬜ Packet filtering

System Security:
- ⬜ Kernel hardening
- ⬜ Service hardening
- ⬜ Resource limits
- ⬜ Update policy

Application Security:
- ⬜ Access control
- ⬜ Authentication
- ⬜ Encryption
- ⬜ Logging

## Advanced Network Configuration {#advanced-network}

### Network Topology {#network-topology}

```plaintext
Internet
   ↓
Firewall (UFW/iptables)
   ↓
WireGuard Server (10.2.0.202)
   ↓
   ├── Client 1 (10.2.1.2)
   ├── Client 2 (10.2.1.3)
   └── AdGuard DNS (10.2.0.204)
```

### Advanced IPTables Configuration {#iptables-config}

Create `/etc/wireguard/iptables.sh`:

```bash
#!/bin/bash

# Variables
WG_INTERFACE="wg0"
PRIVATE_SUBNET="10.2.1.0/24"
DOCKER_SUBNET="172.16.0.0/12"

# Flush existing rules
iptables -F
iptables -t nat -F

# Default policies
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow established connections
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow WireGuard UDP port
iptables -A INPUT -p udp --dport 51830 -j ACCEPT

# Allow VPN traffic forwarding
iptables -A FORWARD -i $WG_INTERFACE -j ACCEPT
iptables -A FORWARD -o $WG_INTERFACE -j ACCEPT

# NAT configuration
iptables -t nat -A POSTROUTING -s $PRIVATE_SUBNET -o eth0 -j MASQUERADE

# Allow internal Docker communication
iptables -A FORWARD -s $DOCKER_SUBNET -d $PRIVATE_SUBNET -j ACCEPT
iptables -A FORWARD -s $PRIVATE_SUBNET -d $DOCKER_SUBNET -j ACCEPT

# Save rules
iptables-save > /etc/iptables/rules.v4
```

### Advanced WireGuard Configuration {#advanced-wireguard}

Create `/etc/wireguard/wg0.conf`:

```ini
[Interface]
Address = 10.2.1.1/24
ListenPort = 51830
PrivateKey = <server_private_key>
PostUp = /etc/wireguard/iptables.sh
PostDown = iptables-restore /etc/iptables/rules.v4.backup

# Enhanced MTU configuration
MTU = 1420

# Enable fwmark for custom routing
FwMark = 0xca6c

# Client Template
[Peer]
# Client 1
PublicKey = <client_public_key>
AllowedIPs = 10.2.1.2/32
PersistentKeepalive = 25

# Rate limiting
# WireGuard itself doesn't support rate limiting, but you can use tc:
# tc qdisc add dev wg0 root tbf rate 1mbit burst 32kbit latency 50ms
```

## Advanced AdGuard Configuration {#advanced-adguard}

### Custom DNS Configuration {#custom-dns}

Create `/opt/adguard/conf/AdGuardHome.yaml`:

```yaml
bind_host: 0.0.0.0
bind_port: 80
users:
  - name: admin
    password: $2a$10$...  # BCrypt hash

dns:
  bind_hosts:
    - 0.0.0.0
  port: 53
  protection_enabled: true
  blocking_mode: default
  blocked_response_ttl: 10
  querylog_enabled: true
  ratelimit: 20
  ratelimit_whitelist: []
  refuse_any: true
  bootstrap_dns:
    - 1.1.1.1
    - 1.0.0.1
  upstream_dns:
    - '[/home/]10.2.0.1'
    - '[/office/]10.2.0.2'
    - 'https://dns.cloudflare.com/dns-query'
    - 'tls://1.1.1.1'
  
  # DNS rewrites
  rewrites:
    - domain: 'internal.company'
      answer: '10.2.0.100'
    - domain: '*.dev.local'
      answer: '10.2.0.150'

  # Optimistic caching
  cache_optimistic: true
  cache_size: 4194304
  cache_ttl_min: 300
  cache_ttl_max: 3600

filtering:
  enabled: true
  url_filtering_enabled: true
  safebrowsing_enabled: true
  safesearch_enabled: true
  safebrowsing_cache_size: 1048576
  safesearch_cache_size: 1048576
  parental_cache_size: 1048576
  cache_time: 30
  filters:
    - enabled: true
      url: 'https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt'
      name: 'AdGuard DNS filter'
    - enabled: true
      url: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts'
      name: 'StevenBlack unified hosts'
```
## Interface Settings Configuration {#interface-settings}

### Accessing Interface Settings {#accessing-settings}

1. Log into WireGuard UI web interface
2. Navigate to "Settings" tab
3. Locate "Interface Settings" section

### Configuring Post Up/Down Scripts {#post-scripts}

#### Post Up Script Configuration {#post-up}

This script enables packet forwarding and NAT for VPN clients:

```bash
iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0+ -j MASQUERADE
```

The script breakdown:
- `-A FORWARD`: Append to FORWARD chain
- `-i %i`: Input interface (WireGuard interface)
- `-o %i`: Output interface (WireGuard interface)
- `-t nat`: Use NAT table
- `-o eth0+`: Match any interface starting with eth0
- `-j MASQUERADE`: Perform IP masquerading

#### Post Down Script Configuration {#post-down}

This script removes the forwarding rules when the interface goes down:

```bash
iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0+ -j MASQUERADE
```

The script breakdown:
- `-D FORWARD`: Delete from FORWARD chain
- Other parameters match the Post Up script but remove rules instead of adding them

### Step-by-Step Implementation {#implementation}

1. **Access WireGuard UI Settings**:
   ```plaintext
   URL: http://your-server-ip:5000/settings
   ```

2. **Navigate to Interface Section**:
   - Look for "WireGuard Interface Settings"
   - Find "Post Up Script" and "Post Down Script" fields

3. **Configure Post Up Script**:
   ```plaintext
   1. Click on "Post Up Script" field
   2. Paste the following command exactly as shown:
   iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0+ -j MASQUERADE
   3. Ensure no extra spaces or characters are added
   ```

4. **Configure Post Down Script**:
   ```plaintext
   1. Click on "Post Down Script" field
   2. Paste the following command exactly as shown:
   iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0+ -j MASQUERADE
   3. Ensure no extra spaces or characters are added
   ```

5. **Save Configuration**:
   - Click "Save" or "Apply Changes"
   - The interface will restart automatically

### Verification Steps {#verification}

1. **Check IPTables Rules**:
```bash
# List forward rules
sudo iptables -L FORWARD -v -n

# List NAT rules
sudo iptables -t nat -L POSTROUTING -v -n
```

2. **Verify Interface Status**:
```bash
# Check WireGuard interface
sudo wg show

# Verify routing
ip route show table all
```

3. **Test Client Connection**:
```bash
# From client side
ping 8.8.8.8
curl ifconfig.me
```

### Troubleshooting {#troubleshooting}

1. **Interface Not Starting**:
```bash
# Check WireGuard logs
sudo tail -f /var/log/syslog | grep wg0

# Verify interface exists
ip link show wg0
```

2. **No Internet Access on Clients**:
```bash
# Check forwarding is enabled
cat /proc/sys/net/ipv4/ip_forward

# Enable forwarding if needed
echo 1 > /proc/sys/net/ipv4/ip_forward
```

3. **NAT Issues**:
```bash
# Clear existing rules
sudo iptables -F
sudo iptables -t nat -F

# Manually apply rules
sudo iptables -A FORWARD -i wg0 -j ACCEPT
sudo iptables -A FORWARD -o wg0 -j ACCEPT
sudo iptables -t nat -A POSTROUTING -o eth0+ -j MASQUERADE
```

### Security Considerations {#security}

1. **Network Interface Matching**:
   - `eth0+` matches any interface starting with eth0
   - Customize this if you have specific interface requirements
   - Example for multiple interfaces:
     ```bash
     -o eth0 -j MASQUERADE; iptables -t nat -A POSTROUTING -o ens+ -j MASQUERADE
     ```

2. **IPTables Persistence**:
```bash
# Save current rules
sudo iptables-save > /etc/iptables/rules.v4

# Restore rules on boot
sudo iptables-restore < /etc/iptables/rules.v4
```

3. **Logging Configuration**:
```bash
# Add logging for forwarded packets
iptables -A FORWARD -j LOG --log-prefix "WireGuard Forward: "
```

### Best Practices {#best-practices}

1. **Regular Verification**:
   - Periodically check rules are applied
   - Monitor system logs for issues
   - Test client connectivity

2. **Backup Configuration**:
```bash
# Backup iptables rules
sudo iptables-save > /etc/iptables/rules.v4.backup

# Backup WireGuard config
cp /etc/wireguard/wg0.conf /etc/wireguard/wg0.conf.backup
```

3. **Monitoring**:
```bash
# Monitor interface traffic
watch -n 1 'sudo wg show wg0'

# Check active connections
sudo netstat -tunlp | grep wg0
```

::: tip Important
Remember to:
1. Test configuration after changes
2. Backup working configurations
3. Monitor system logs
4. Keep interface scripts updated
5. Verify client connectivity
:::

## Performance Optimization {#performance-optimization}

### WireGuard Kernel Parameters {#kernel-parameters}

Add to the end of file `/etc/sysctl.conf`:

```bash
# Disable IPv6 if not needed
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1

# Essential WireGuard Requirements
net.ipv4.ip_forward = 1
net.ipv4.conf.all.src_valid_mark = 1

# TCP Memory Settings
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 87380 16777216

# UDP Settings (if available)
net.ipv4.udp_rmem_min = 8192
net.ipv4.udp_wmem_min = 8192

# Memory Settings (verified working)
net.core.optmem_max = 65536

# TCP Settings
net.ipv4.tcp_mtu_probing = 1
net.ipv4.tcp_slow_start_after_idle = 0

```

```sh
sysctl -p
```

### IO Optimization {#io-optimization}

Update Docker daemon configuration `/etc/docker/daemon.json`:

```json
{
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  }
}
```

## Advanced Security Configuration {#advanced-security}
### Install Fail2ban

```sh
sudo apt -y install fail2ban
```



### Fail2ban Configuration {#fail2ban}
Create `/etc/fail2ban/jail.d/wireguard.conf`:

```ini
[wireguard]
enabled = true
port = 51830
protocol = udp
filter = wireguard
logpath = /var/log/wireguard.log
maxretry = 3
bantime = 3600
findtime = 600

[wireguard-ui]
enabled = false # disabled
port = 5000
protocol = tcp
filter = wireguard-ui
logpath = /var/log/wireguard-ui.log
maxretry = 5
bantime = 3600
findtime = 600
```

Create `/etc/fail2ban/filter.d/wireguard.conf`:

```ini
[Definition]
failregex = Failed authentication attempt from <HOST>
ignoreregex =
```


## Advanced Monitoring {#advanced-monitoring}

### Prometheus Metrics {#prometheus-metrics}

Create `/etc/prometheus/config.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'wireguard'
    static_configs:
      - targets: ['localhost:9586']
    metrics_path: '/metrics'
    
  - job_name: 'adguard'
    static_configs:
      - targets: ['localhost:9617']
    metrics_path: '/metrics'
```

### Grafana Dashboard {#grafana-dashboard}

```json
{
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": "-- Grafana --",
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "name": "Annotations & Alerts",
        "type": "dashboard"
      }
    ]
  },
  "panels": [
    {
      "title": "WireGuard Connections",
      "type": "graph",
      "datasource": "Prometheus",
      "targets": [
        {
          "expr": "wireguard_peer_receive_bytes_total",
          "legendFormat": "{{peer_name}} RX"
        },
        {
          "expr": "wireguard_peer_transmit_bytes_total",
          "legendFormat": "{{peer_name}} TX"
        }
      ]
    }
  ]
}
```

## Disaster Recovery {#disaster-recovery}

### Automated Backup Script {#backup-script}

Create `/usr/local/bin/backup-vpn.sh`:

```bash
#!/bin/bash

# Configuration
BACKUP_ROOT="/backup/vpn"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="${BACKUP_ROOT}/${DATE}"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Stop services
docker-compose down

# Backup configuration files
tar -czf "${BACKUP_DIR}/configs.tar.gz" \
    /etc/wireguard \
    /etc/adguard \
    /opt/wireguard-ui/docker-compose.yml \
    /opt/wireguard-ui/.env

# Backup databases
tar -czf "${BACKUP_DIR}/data.tar.gz" \
    /opt/wireguard-ui/db \
    /opt/adguard/opt-adguard-work

# Export container configurations
docker-compose config > "${BACKUP_DIR}/docker-compose-resolved.yml"

# Create backup checksum
cd "${BACKUP_DIR}"
sha256sum * > SHA256SUMS

# Restart services
docker-compose up -d

# Remove old backups
find "${BACKUP_ROOT}" -type d -mtime +${RETENTION_DAYS} -exec rm -rf {} \;

# Verify backup
if [ -f "${BACKUP_DIR}/configs.tar.gz" ] && \
   [ -f "${BACKUP_DIR}/data.tar.gz" ]; then
    echo "Backup completed successfully"
    exit 0
else
    echo "Backup failed!"
    exit 1
fi
```



::: tip Important Security Notes
1. Regularly audit peer configurations
2. Monitor for unauthorized access attempts
3. Keep all systems updated
4. Use secure DNS over TLS/HTTPS
5. Implement proper network segmentation
:::