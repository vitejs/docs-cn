---
title: Traefik v3
---

# Traefik v3 Configuration Guide {#traefik-v3}

## Introduction {#introduction}

Traefik v3 is a modern HTTP reverse proxy and load balancer that makes deploying microservices easy. This guide provides practical configurations for setting up Traefik v3 with Docker.

## Environment Variables {#environment}

Create a `.env` file in your project root:

```env
# Traefik Dashboard
TRAEFIK_DASHBOARD_DOMAIN=traefik.example.com
TRAEFIK_DASHBOARD_USER=admin
TRAEFIK_DASHBOARD_PASSWORD_HASH=$apr1$d9hr9HBB$4HxwgUir3HP4EsggP/QNo0  # htpasswd -nb admin password

# SSL Configuration
ACME_EMAIL=admin@example.com
SSL_RESOLVER=https://acme-staging-v02.api.letsencrypt.org/directory
# https://acme-v02.api.letsencrypt.org/directory

# Network Configuration
TRAEFIK_NETWORK=traefik_proxy

# Ports
TRAEFIK_HTTP_PORT=80
TRAEFIK_HTTPS_PORT=443

# Log Configuration
LOG_LEVEL=INFO
LOG_FILE=/var/log/traefik/traefik.log

# Middleware Configurations
RATE_LIMIT_AVERAGE=100
RATE_LIMIT_BURST=50

# Redis Configuration (for rate limiting)
REDIS_HOST=redis
REDIS_PORT=6379
```

## Directory Structure {#directory}

```bash
/etc/traefik/
├── config/
│   ├── dynamic/
│   │   ├── middleware.yml
│   │   └── tls.yml
│   └── traefik.yml
├── certs/
│   └── acme.json
└── logs/
    └── traefik.log
```

## Static Configuration {#static-configuration}

Create `/etc/traefik/config/traefik.yml`:

```yaml
global:
  checkNewVersion: true
  sendAnonymousUsage: false

log:
  level: ${LOG_LEVEL}
  filePath: ${LOG_FILE}
  format: json

api:
  dashboard: true
  debug: false

metrics:
  prometheus: {}

entryPoints:
  web:
    address: ":${TRAEFIK_HTTP_PORT}"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true
  
  websecure:
    address: ":${TRAEFIK_HTTPS_PORT}"
    http:
      tls:
        certResolver: letsencrypt
        domains:
          - main: "${TRAEFIK_DASHBOARD_DOMAIN}"
            sans:
              - "*.${TRAEFIK_DASHBOARD_DOMAIN}"

certificatesResolvers:
  letsencrypt:
    acme:
      email: ${ACME_EMAIL}
      storage: /etc/traefik/certs/acme.json
      httpChallenge:
        entryPoint: web
      caServer: ${SSL_RESOLVER}

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    watch: true
    exposedByDefault: false
    network: ${TRAEFIK_NETWORK}
    
  file:
    directory: /etc/traefik/config/dynamic
    watch: true
```

## Dynamic Configuration {#dynamic-configuration}

### Middleware Configuration {#middleware}

Create `/etc/traefik/config/dynamic/middleware.yml`:

```yaml
http:
  middlewares:
    secure-headers:
      headers:
        sslRedirect: true
        forceSTSHeader: true
        stsIncludeSubdomains: true
        stsPreload: true
        stsSeconds: 31536000
        customFrameOptionsValue: "SAMEORIGIN"
        contentTypeNosniff: true
        browserXssFilter: true
        referrerPolicy: "strict-origin-when-cross-origin"
        permissionsPolicy: "camera=(), microphone=(), geolocation=(), payment=()"
        customResponseHeaders:
          X-Robots-Tag: "none,noarchive,nosnippet,notranslate,noimageindex"
          server: ""

    rate-limit:
      rateLimit:
        average: ${RATE_LIMIT_AVERAGE}
        burst: ${RATE_LIMIT_BURST}
        sourceCriterion:
          ipStrategy:
            depth: 1
            excludedIPs:
              - "127.0.0.1/32"
              - "10.0.0.0/8"

    compression:
      compress:
        excludedContentTypes:
          - "text/event-stream"

    basic-auth:
      basicAuth:
        users:
          - "${TRAEFIK_DASHBOARD_USER}:${TRAEFIK_DASHBOARD_PASSWORD_HASH}"
```

### TLS Configuration {#tls}

Create `/etc/traefik/config/dynamic/tls.yml`:

```yaml
tls:
  options:
    default:
      minVersion: VersionTLS12
      sniStrict: true
      cipherSuites:
        - TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
        - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305
        - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
        - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305
```

## Docker Compose Configuration {#docker-compose}

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v3.0
    container_name: traefik
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    networks:
      - ${TRAEFIK_NETWORK}
    ports:
      - "${TRAEFIK_HTTP_PORT}:${TRAEFIK_HTTP_PORT}"
      - "${TRAEFIK_HTTPS_PORT}:${TRAEFIK_HTTPS_PORT}"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /etc/traefik/config:/etc/traefik
      - /etc/traefik/certs:/etc/traefik/certs
      - /etc/traefik/logs:/var/log/traefik
    environment:
      - TZ=UTC
    labels:
      - "traefik.enable=true"
      # Dashboard
      - "traefik.http.routers.dashboard.rule=Host(`${TRAEFIK_DASHBOARD_DOMAIN}`)"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.entrypoints=websecure"
      - "traefik.http.routers.dashboard.middlewares=basic-auth,secure-headers"
      # API
      - "traefik.http.routers.api.rule=Host(`${TRAEFIK_DASHBOARD_DOMAIN}`) && PathPrefix(`/api`)"
      - "traefik.http.routers.api.service=api@internal"
      - "traefik.http.routers.api.entrypoints=websecure"
      - "traefik.http.routers.api.middlewares=basic-auth,secure-headers"

  redis:
    image: redis:alpine
    container_name: traefik_redis
    restart: unless-stopped
    networks:
      - ${TRAEFIK_NETWORK}
    volumes:
      - redis_data:/data
    ports:
      - "${REDIS_PORT}:${REDIS_PORT}"

volumes:
  redis_data:

networks:
  traefik_proxy:
    name: ${TRAEFIK_NETWORK}
    external: true
```

## Example Service Configuration {#example-service}

Here's an example of how to configure a service to use Traefik:

```yaml
version: '3.8'

services:
  whoami:
    image: traefik/whoami
    container_name: whoami
    networks:
      - ${TRAEFIK_NETWORK}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.whoami.rule=Host(`whoami.${TRAEFIK_DASHBOARD_DOMAIN}`)"
      - "traefik.http.routers.whoami.entrypoints=websecure"
      - "traefik.http.routers.whoami.middlewares=secure-headers,rate-limit"
      - "traefik.http.services.whoami.loadbalancer.server.port=80"
```

## Initial Setup {#initial-setup}

1. Create required directories and files:

```bash
# Create directories
sudo mkdir -p /etc/traefik/{config/{dynamic},certs,logs}

# Set permissions
sudo chmod 600 /etc/traefik/certs/acme.json
sudo chown -R root:root /etc/traefik

# Create network
docker network create ${TRAEFIK_NETWORK}
```

2. Generate password hash:

```bash
docker run --rm httpd:alpine htpasswd -nb admin password
```

3. Start Traefik:

```bash
docker-compose up -d
```

## Monitoring {#monitoring}

### Prometheus Configuration {#prometheus}

Add to your Prometheus configuration:

```yaml
scrape_configs:
  - job_name: 'traefik'
    static_configs:
      - targets: ['traefik:8082']
```

### Health Check Configuration {#health-check}

Create a health check endpoint in dynamic configuration:

```yaml
http:
  routers:
    health:
      rule: "Path(`/health`)"
      service: health
      middlewares:
        - "secure-headers"
  services:
    health:
      loadBalancer:
        healthCheck:
          path: /ping
          interval: "10s"
          timeout: "3s"
```

## Best Practices {#best-practices}

1. **Security**:
   - Always use HTTPS
   - Implement rate limiting
   - Use secure headers
   - Regularly update Traefik and dependencies
   - Restrict dashboard access

2. **Performance**:
   - Enable compression
   - Use Redis for rate limiting
   - Implement proper caching strategies
   - Monitor resource usage

3. **Maintenance**:
   - Regularly backup certificates
   - Monitor logs
   - Keep configurations in version control
   - Document all customizations

## Troubleshooting {#troubleshooting}

1. Check logs:
```bash
docker logs traefik
```

2. Verify configuration:
```bash
docker exec traefik traefik healthcheck
```

3. Test TLS configuration:
```bash
curl -vI https://${TRAEFIK_DASHBOARD_DOMAIN}
```

::: tip Important
Remember to:
1. Replace example.com with your actual domain
2. Generate secure passwords
3. Backup certificates and configurations
4. Monitor logs and metrics
5. Keep Traefik updated
:::