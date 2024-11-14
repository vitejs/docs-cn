---
title: Traefik v3
---

# Advanced Traefik v3 Technical Guide {#advanced-traefik}

## Understanding Reverse Proxy Architecture {#reverse-proxy}

### Core Concepts {#core-concepts}

A reverse proxy acts as an intermediate server between clients and backend services. Key advantages include:

1. **Load Distribution**:
   - Layer 4 (TCP/UDP)
   - Layer 7 (HTTP/HTTPS)
   - Dynamic service discovery

2. **Security Benefits**:
   - Hide backend infrastructure
   - DDoS protection
   - SSL/TLS termination
   - Request filtering

### Traefik's Architecture {#traefik-architecture}

```plaintext
Client Request → EntryPoints → Routers → Middlewares → Services → Backend
```

#### Components Breakdown:

1. **EntryPoints**:
   - Network entry points (TCP/UDP)
   - Protocol definitions
   - Port bindings

2. **Routers**:
   - Rule matching
   - Priority handling
   - TLS configuration
   - Service binding

3. **Middlewares**:
   - Request modification
   - Authentication
   - Rate limiting
   - Headers manipulation

4. **Services**:
   - Load balancing
   - Health checks
   - Sticky sessions
   - Failover strategies

## Advanced Middleware Configurations {#advanced-middleware}

### Authentication Middleware {#auth-middleware}

```yaml
http:
  middlewares:
    oauth-auth:
      forwardAuth:
        address: "http://oauth-server:4181"
        trustForwardHeader: true
        authResponseHeaders:
          - "X-Forwarded-User"
        tls:
          insecureSkipVerify: false
          
    jwt-auth:
      forwardAuth:
        address: "http://jwt-validator:3000"
        authResponseHeaders:
          - "X-User-ID"
          - "X-User-Role"
```

### Advanced Rate Limiting {#rate-limiting}

```yaml
http:
  middlewares:
    complex-ratelimit:
      rateLimit:
        average: 100
        burst: 50
        period: 1s
        sourceCriterion:
          requestHeaderName: "X-Real-IP"
          requestHost: true
          ipStrategy:
            depth: 2
            excludedIPs:
              - "127.0.0.1/32"
              - "10.0.0.0/8"
        rateLimiters:
          - name: "global"
            limit: 1000
            period: "1m"
          - name: "per-ip"
            limit: 100
            period: "1m"
```

### Circuit Breaker {#circuit-breaker}

```yaml
http:
  middlewares:
    circuit-breaker:
      circuitBreaker:
        expression: "NetworkErrorRatio() > 0.30 || ResponseCodeRatio(500, 600, 0, 600) > 0.25"
        checkPeriod: "10s"
        fallbackDuration: "30s"
```

### Request Transformation {#request-transform}

```yaml
http:
  middlewares:
    request-transform:
      headers:
        customRequestHeaders:
          X-Script-Name: "/api"
        customResponseHeaders:
          X-Custom-Response: "Modified"
        sslRedirect: true
        sslHost: "example.com"
        sslForceHost: true
        stsSeconds: 31536000
        stsIncludeSubdomains: true
        stsPreload: true
        forceSTSHeader: true
        frameDeny: true
        customFrameOptionsValue: "SAMEORIGIN"
        contentTypeNosniff: true
        browserXssFilter: true
        contentSecurityPolicy: "default-src 'self'"
        referrerPolicy: "strict-origin-when-cross-origin"
```

## Enhanced Security Configurations {#enhanced-security}

### ModSecurity Integration {#modsecurity}

```yaml
http:
  middlewares:
    modsecurity:
      plugin:
        modsecurity:
          configFile: "/etc/modsecurity/modsecurity.conf"
          rules: |
            SecRuleEngine On
            SecRule REQUEST_HEADERS:User-Agent "@contains bad" "id:1,deny,status:403"
```

### OAuth2 Configuration {#oauth2}

```yaml
http:
  middlewares:
    oauth2-proxy:
      forwardAuth:
        address: "http://oauth2-proxy:4180"
        trustForwardHeader: true
        authResponseHeaders:
          - "X-Auth-Request-Access-Token"
          - "X-Auth-Request-User"
          - "X-Auth-Request-Email"
        tls:
          cert: "/path/to/cert.pem"
          key: "/path/to/key.pem"
```

## Advanced Service Discovery {#service-discovery}

### Consul Integration {#consul}

```yaml
providers:
  consul:
    endpoints:
      - "consul-server:8500"
    rootKey: "traefik"
    namespaces: ["production", "staging"]
    token: "consul-token"
    refreshInterval: "30s"
```

### Kubernetes CRD Configuration {#kubernetes-crd}

```yaml
providers:
  kubernetesIngress:
    ingressClass: "traefik-internal"
    allowExternalNameServices: true
    allowCrossNamespace: true
    namespaces:
      - "default"
      - "kube-system"
```

## Advanced Metrics and Monitoring {#advanced-metrics}

### Detailed Prometheus Configuration {#detailed-prometheus}

```yaml
metrics:
  prometheus:
    buckets:
      - 0.1
      - 0.3
      - 1.2
      - 5.0
    addEntryPointsLabels: true
    addServicesLabels: true
    statsd:
      address: "localhost:8125"
      pushInterval: "10s"
    influxDB:
      address: "localhost:8089"
      protocol: "udp"
      database: "traefik"
      retentionPolicy: "autogen"
      pushInterval: "10s"
```

### Grafana Dashboard Configuration {#grafana}

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
      "title": "Request Duration",
      "type": "graph",
      "datasource": "Prometheus",
      "targets": [
        {
          "expr": "histogram_quantile(0.95, sum(rate(traefik_service_request_duration_seconds_bucket[5m])) by (le, service))",
          "legendFormat": "{{service}}"
        }
      ]
    }
  ]
}
```

## Advanced TLS Configuration {#advanced-tls}

### MTLS Configuration {#mtls}

```yaml
tls:
  options:
    mtls:
      minVersion: VersionTLS13
      sniStrict: true
      clientAuth:
        caFiles:
          - /path/to/ca.crt
        clientAuthType: RequireAndVerifyClientCert
      curvePreferences:
        - CurveP521
        - CurveP384
      cipherSuites:
        - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305
```

### Dynamic Certificate Configuration {#dynamic-certs}

```yaml
tls:
  certificates:
    - certFile: /path/to/cert.pem
      keyFile: /path/to/key.pem
      stores:
        - default
  stores:
    default:
      defaultCertificate:
        certFile: /path/to/default.pem
        keyFile: /path/to/default.key
```

## Performance Optimization {#performance}

### Worker Pool Configuration {#worker-pool}

```yaml
experimental:
  plugins:
    performance:
      poolSize: 10
      maxIdleConnsPerHost: 100
      maxConnsPerHost: 250
      idleTimeout: "90s"
      responseHeaderTimeout: "30s"
```

### Caching Strategy {#caching}

```yaml
http:
  middlewares:
    cache:
      plugin:
        caching:
          maxAge: 3600
          staleWhileRevalidate: 300
          staleIfError: 600
          methods:
            - GET
            - HEAD
          headers:
            - Authorization
          statusCodes:
            - 200
            - 404
```

## High Availability Setup {#high-availability}

### Cluster Configuration {#cluster}

```yaml
cluster:
  node:
    id: "node1"
    address: "10.0.0.1:4242"
  peers:
    - id: "node2"
      address: "10.0.0.2:4242"
    - id: "node3"
      address: "10.0.0.3:4242"
  retry:
    attempts: 3
    initialInterval: "500ms"
```

### Redis Configuration for Session Persistence {#redis-session}

```yaml
http:
  middlewares:
    sticky-session:
      plugin:
        sticky:
          cookieName: "SERVERID"
          redis:
            endpoints:
              - "redis:6379"
            password: "${REDIS_PASSWORD}"
            db: 0
```

## Logging and Debugging {#logging-debugging}

### Advanced Logging Configuration {#advanced-logging}

```yaml
log:
  level: DEBUG
  format: json
  filePath: "/var/log/traefik/access.log"
  fields:
    defaultMode: keep
    names:
      ClientUsername: drop
    headers:
      defaultMode: keep
      names:
        User-Agent: redact
        Authorization: drop
        Cookie: drop
```

### Access Log Configuration {#access-log}

```yaml
accessLog:
  filePath: "/var/log/traefik/access.log"
  format: json
  bufferingSize: 100
  fields:
    defaultMode: keep
    names:
      ClientUsername: drop
    headers:
      defaultMode: drop
      names:
        User-Agent: keep
        Authorization: redact
        Content-Type: keep
```

## Best Security Practices {#security-practices}

1. **Headers Security**:
   - Use CSP (Content Security Policy)
   - Enable HSTS (HTTP Strict Transport Security)
   - Implement X-Frame-Options
   - Configure X-Content-Type-Options

2. **Network Security**:
   - Implement IP whitelisting
   - Use VPN or private networks
   - Configure proper firewall rules
   - Monitor network traffic

3. **Authentication**:
   - Implement MFA where possible
   - Use strong password policies
   - Regularly rotate credentials
   - Audit authentication logs

4. **Certificate Management**:
   - Automate certificate renewal
   - Monitor certificate expiration
   - Use strong key algorithms
   - Implement OCSP stapling

::: tip Security Reminder
Always follow the principle of least privilege and regularly audit your security configurations. Keep all components updated and monitor security advisories.
:::