---
title: Vaultwarden - Self-Hosted Password Management
---

# Vaultwarden - Self-Hosted Password Management {#vaultwarden}

<DifficultyIndicator 
  :difficulty="3" 
  label="Vaultwarden Setup" 
  time="2-4 hours" 
  :prerequisites="['Docker', 'Reverse proxy knowledge', 'SSL/TLS basics']"
>
  Setting up Vaultwarden involves container configuration, database setup, and proper security implementation. The complexity increases when configuring backup strategies, email integration, and implementing high availability.
</DifficultyIndicator>

## Introduction to Password Security {#password-security}

Password security is fundamental to digital safety. In an era where the average person has over 100 online accounts, proper password management is crucial. Common password security issues include:

1. **Password Reuse**: Using the same password across multiple services
2. **Weak Passwords**: Simple, easily guessable combinations
3. **Insecure Storage**: Writing passwords in plain text or unsecured notes
4. **Manual Management**: Trying to remember multiple complex passwords

### Why Password Managers Matter {#why-password-managers}

Password managers solve these problems by:
- Generating strong, unique passwords
- Securely encrypting stored credentials
- Providing easy access across devices
- Supporting secure sharing capabilities
- Enabling two-factor authentication (2FA)

### Vaultwarden vs Other Solutions {#vaultwarden-vs-others}

Vaultwarden, a Bitwarden-compatible server, offers:
- Complete control over your data
- No subscription fees
- Self-hosted security
- Compatible with all Bitwarden clients
- Lower resource requirements
- Enhanced privacy

## Environment Variables {#environment}

Create a `.env` file in your project root:

```env
# Server Configuration
DOMAIN=vault.yourdomain.com
HTTP_PORT=80
HTTPS_PORT=443

# Admin Configuration
ADMIN_TOKEN=generate_strong_token_here
ADMIN_PASSWORD=your_secure_admin_password

# Security Settings
SIGNUPS_ALLOWED=true
INVITATIONS_ALLOWED=false
SHOW_PASSWORD_HINT=false
EMERGENCY_ACCESS_ALLOWED=false
ORGANIZATIONS_ALLOWED=true

# Email Configuration (Optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SSL=true
SMTP_USERNAME=your_email@example.com
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=vaultwarden@yourdomain.com

# Resource Limits
DOCKER_CPU_LIMIT=1.0
DOCKER_MEMORY_LIMIT=512M

# Backup Configuration
BACKUP_DIR=/path/to/backup
BACKUP_RETENTION_DAYS=30

# Web Socket
WEBSOCKET_ENABLED=true
WEB_VAULT_ENABLED=true

# Database
DB_BACKUP_DIR=/data/backup
```

## Directory Structure {#directory}

```bash
./vaultwarden/
├── docker-compose.yml
├── .env
├── nginx/
│   └── conf.d/
│       └── vaultwarden.conf
├── data/
│   ├── config.json
│   ├── db.sqlite3
│   ├── attachments/
│   ├── sends/
│   └── icon_cache/
└── backups/
```

## Docker Compose Configuration {#docker-compose}

Extended version of your configuration with additional security and monitoring:

```yaml
version: '3.8'

services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: always
    env_file: .env
    environment:
      - WEBSOCKET_ENABLED=${WEBSOCKET_ENABLED}
      - SIGNUPS_ALLOWED=${SIGNUPS_ALLOWED}
      - INVITATIONS_ALLOWED=${INVITATIONS_ALLOWED}
      - SHOW_PASSWORD_HINT=${SHOW_PASSWORD_HINT}
      - DOMAIN=${DOMAIN}
      - ADMIN_TOKEN=${ADMIN_TOKEN}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_FROM=${SMTP_FROM}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_SSL=${SMTP_SSL}
      - SMTP_USERNAME=${SMTP_USERNAME}
      - SMTP_PASSWORD=${SMTP_PASSWORD}
      - EMERGENCY_ACCESS_ALLOWED=${EMERGENCY_ACCESS_ALLOWED}
      - ORGANIZATIONS_ALLOWED=${ORGANIZATIONS_ALLOWED}
    ports:
      - "${HTTP_PORT}:80"
      - "${HTTPS_PORT}:443"
    volumes:
      - vaultwarden_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/alive"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: ${DOCKER_CPU_LIMIT}
          memory: ${DOCKER_MEMORY_LIMIT}
        reservations:
          memory: 256M
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp

  backup:
    image: alpine:latest
    container_name: vaultwarden_backup
    volumes:
      - vaultwarden_data:/data:ro
      - ./backups:/backup
    command: |
      sh -c 'while true; do
        tar czf /backup/vaultwarden-$(date +%Y%m%d_%H%M%S).tar.gz /data;
        find /backup -type f -mtime +${BACKUP_RETENTION_DAYS} -delete;
        sleep 86400;
      done'
    deploy:
      resources:
        limits:
          cpus: "0.2"
          memory: "128M"

volumes:
  vaultwarden_data:
    driver: local

networks:
  default:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/24
```

## Initial Setup {#initial-setup}

1. Generate secure admin token:
```bash
openssl rand -base64 48
```

2. Create required directories:
```bash
mkdir -p {data,backups,nginx/conf.d}
```

3. Set proper permissions:
```bash
chmod 700 data backups
```

4. Start services:
```bash
docker-compose up -d
```

## Security Hardening {#security-hardening}

### System Level Security {#system-security}

1. **Firewall Configuration**:
```bash
# UFW Configuration
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

2. **Fail2Ban Integration**:

Create `/etc/fail2ban/jail.d/vaultwarden.conf`:
```ini
[vaultwarden]
enabled = true
port = 80,443
filter = vaultwarden
logpath = /path/to/vaultwarden/data/vaultwarden.log
maxretry = 5
bantime = 14400
findtime = 14400
```

### Application Security {#application-security}

1. **SSL Configuration**:
```bash
# Generate Diffie-Hellman parameters
openssl dhparam -out /etc/ssl/certs/dhparam.pem 4096
```

2. **NGINX Configuration** (`nginx/conf.d/vaultwarden.conf`):
```nginx
server {
    listen 443 ssl http2;
    server_name vault.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/vault.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vault.yourdomain.com/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        proxy_pass http://vaultwarden:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /notifications/hub/negotiate {
        proxy_pass http://vaultwarden:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /notifications/hub {
        proxy_pass http://vaultwarden:3012;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

server {
    listen 80;
    server_name vault.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Backup Strategy {#backup-strategy}

### Automated Backups {#automated-backups}

Create `backup-vaultwarden.sh`:
```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/vaultwarden-${TIMESTAMP}"

# Stop Vaultwarden
docker-compose stop vaultwarden

# Backup data
tar czf "${BACKUP_PATH}.tar.gz" ./data

# Restart Vaultwarden
docker-compose start vaultwarden

# Remove old backups
find ${BACKUP_DIR} -type f -mtime +${BACKUP_RETENTION_DAYS} -delete

# Verify backup
if [ -f "${BACKUP_PATH}.tar.gz" ]; then
    echo "Backup successful: ${BACKUP_PATH}.tar.gz"
else
    echo "Backup failed!"
    exit 1
fi
```

### Remote Backup {#remote-backup}

Add to `backup-vaultwarden.sh`:
```bash
# Sync to remote storage
rclone copy "${BACKUP_PATH}.tar.gz" remote:vaultwarden-backups/
```

## Monitoring {#monitoring}

### Health Checks {#health-checks}

Create `check-vaultwarden.sh`:
```bash
#!/bin/bash
curl -f http://localhost:80/alive || exit 1
```

### Resource Monitoring {#resource-monitoring}

```bash
# Check container stats
docker stats vaultwarden

# Check logs
docker logs vaultwarden
```

## Best Practices for Users {#user-best-practices}

1. **Master Password Guidelines**:
   - Minimum 16 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Avoid personal information
   - Use a memorable passphrase

2. **Two-Factor Authentication**:
   - Enable 2FA for vault access
   - Use authenticator apps instead of SMS
   - Backup 2FA recovery codes

3. **Regular Security Audits**:
   - Check for weak passwords
   - Review active sessions
   - Update emergency access
   - Verify account activity

4. **Secure Data Management**:
   - Regular export of vault data
   - Review shared items
   - Update passwords periodically
   - Check breach reports

## Troubleshooting {#troubleshooting}

1. **Connection Issues**:
```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs vaultwarden
```

2. **Database Issues**:
```bash
# Verify database integrity
sqlite3 data/db.sqlite3 "PRAGMA integrity_check;"
```

3. **Memory Issues**:
```bash
# Check memory usage
docker stats vaultwarden
```

::: tip Important Security Notes
1. Never store the master password
2. Enable 2FA for all users
3. Regular security audits
4. Keep backups encrypted
5. Monitor access logs
:::