---
title: CrowdsSec Tutorial
---

# CrowdSec Tutorial for Linux {#crowdsec-tutorial}

## Introduction {#introduction}

CrowdSec is a modern, free, and collaborative security engine that helps protect Linux servers, services, and applications. This guide covers installation, configuration, and best practices for using CrowdSec on Linux systems.

## Prerequisites {#prerequisites}

Before installing CrowdSec, ensure your system meets these requirements:
- Linux OS (Debian, Ubuntu, CentOS, RHEL, etc.)
- Sudo or root access
- Systemd (for service management)
- curl or wget installed
- Valid logging system (such as syslog, journald)

## Installation {#installation}

### Debian/Ubuntu Installation {#debian-installation}

```bash
# Add CrowdSec repository
curl -s https://packagecloud.io/install/repositories/crowdsec/crowdsec/script.deb.sh | sudo bash

# Install CrowdSec
sudo apt-get install crowdsec

# Install collections
sudo cscli collections install crowdsecurity/linux
sudo cscli collections install crowdsecurity/nginx
```

### RHEL/CentOS Installation {#rhel-installation}

```bash
# Add CrowdSec repository
curl -s https://packagecloud.io/install/repositories/crowdsec/crowdsec/script.rpm.sh | sudo bash

# Install CrowdSec
sudo yum install crowdsec

# Install collections
sudo cscli collections install crowdsecurity/linux
sudo cscli collections install crowdsecurity/nginx
```

## Basic Configuration {#basic-configuration}

### Main Configuration File {#main-config}

The main configuration file is located at `/etc/crowdsec/config.yaml`:

```yaml
common:
  daemonize: true
  pid_dir: /var/run/
  log_media: file
  log_level: info
  log_dir: /var/log/
  working_dir: /var/lib/crowdsec/data/

config_paths:
  config_dir: /etc/crowdsec/
  data_dir: /var/lib/crowdsec/data/
  simulation_path: /etc/crowdsec/simulation.yaml
  hub_dir: /etc/crowdsec/hub/

crowdsec_service:
  acquisition_path: /etc/crowdsec/acquis.yaml
  parser_routines: 1
```

### Acquisition Configuration {#acquisition-config}

Create or modify `/etc/crowdsec/acquis.yaml` to specify log sources:

```yaml
filenames:
  - /var/log/auth.log
  - /var/log/syslog
labels:
  type: syslog

---

filenames:
  - /var/log/nginx/access.log
labels:
  type: nginx
```

## Bouncers Installation {#bouncers}

### Firewall Bouncer {#firewall-bouncer}

```bash
# Install firewall-bouncer
sudo apt-get install crowdsec-firewall-bouncer-iptables

# Configure bouncer
sudo vim /etc/crowdsec/bouncers/crowdsec-firewall-bouncer.yaml

# Example configuration:
```

```yaml
mode: iptables
update_frequency: 10s
log_level: info
api_url: http://localhost:8080/
api_key: ${API_KEY}  # Replace with your API key
deny_action: DROP
deny_log: true
```

### Nginx Bouncer {#nginx-bouncer}

```bash
# Install nginx bouncer
sudo apt-get install crowdsec-nginx-bouncer

# Configure bouncer
sudo vim /etc/crowdsec/bouncers/crowdsec-nginx-bouncer.yaml

# Example configuration:
```

```yaml
api_url: http://localhost:8080/
api_key: ${API_KEY}  # Replace with your API key
update_frequency: 10s
deny_status_code: 403
deny_message: "Access denied by CrowdSec"
```

## Managing CrowdSec {#managing-crowdsec}

### Basic Commands {#basic-commands}

```bash
# Check CrowdSec status
sudo systemctl status crowdsec

# View real-time decisions
sudo cscli decisions list

# View active scenarios
sudo cscli scenarios list

# View metrics
sudo cscli metrics

# View banned IPs
sudo cscli decisions list -t ban
```

### Adding Custom Scenarios {#custom-scenarios}

Create a custom scenario in `/etc/crowdsec/scenarios/custom-ssh.yaml`:

```yaml
type: leaky
name: custom-ssh-bf
description: "Detect SSH bruteforce"
filter: "evt.Meta.log_type == 'syslog' && evt.Meta.service == 'sshd'"
groupby: "evt.Meta.source_ip"
capacity: 5
leakspeed: "10s"
blackhole: 5m
labels:
  service: ssh
  type: bruteforce
  remediation: true
pattern: 'Invalid user|Failed password'
```

### Managing Collections {#managing-collections}

```bash
# List available collections
sudo cscli collections list

# Install a collection
sudo cscli collections install crowdsecurity/wordpress

# Remove a collection
sudo cscli collections remove crowdsecurity/wordpress

# Upgrade collections
sudo cscli collections upgrade
```

## Advanced Configuration {#advanced-configuration}

### Custom Parsers {#custom-parsers}

Create a custom parser in `/etc/crowdsec/parsers/custom-app.yaml`:

```yaml
name: crowdsecurity/custom-app-parser
description: "Parser for custom application logs"
pattern_syntax: "%{TIMESTAMP_ISO8601:timestamp} %{WORD:level} %{GREEDYDATA:message}"
nodes:
  - grok:
      pattern: '%{TIMESTAMP_ISO8601:timestamp} %{WORD:level} \[%{WORD:component}\] %{GREEDYDATA:message}'
      apply_on: message
  - grok:
      pattern: 'user=%{WORD:user} action=%{WORD:action}'
      apply_on: message
```

### Custom Postoverflows {#custom-postoverflows}

Create a custom postoverflow in `/etc/crowdsec/postoverflows/custom-enrich.yaml`:

```yaml
name: crowdsecurity/custom-enrich
description: "Enrich alerts with custom data"
filter: "evt.Meta.service == 'ssh'"
postoverflow:
  - set:
      value: high
      target: evt.Enriched.severity
  - set:
      value: ssh-abuse
      target: evt.Enriched.category
```

## Monitoring and Maintenance {#monitoring}

### Setting Up Monitoring {#setup-monitoring}

```bash
# Enable metrics
sudo cscli metrics enable

# Configure Prometheus metrics
sudo vim /etc/crowdsec/config.yaml
```

Add prometheus configuration:

```yaml
prometheus:
  enabled: true
  listen_addr: 127.0.0.1
  listen_port: 6060
```

### Log Rotation {#log-rotation}

Create `/etc/logrotate.d/crowdsec`:

```text
/var/log/crowdsec.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 640 crowdsec crowdsec
    postrotate
        systemctl reload crowdsec
    endscript
}
```

## Troubleshooting {#troubleshooting}

### Common Issues {#common-issues}

1. Check logs for errors:
```bash
sudo tail -f /var/log/crowdsec.log
```

2. Debug mode:
```bash
sudo cscli config show --debug
```

3. Test configurations:
```bash
sudo crowdsec -c /etc/crowdsec/config.yaml -t
```

### Performance Tuning {#performance-tuning}

Modify `/etc/crowdsec/config.yaml`:

```yaml
crowdsec_service:
  parser_routines: 4
  bucket_routines: 4
  output_routines: 4
```

## Best Practices {#best-practices}

1. **Regular Updates:**
```bash
# Update CrowdSec and collections
sudo apt update
sudo apt upgrade crowdsec
sudo cscli hub update
sudo cscli collections upgrade
```

2. **Backup Configuration:**
```bash
# Backup critical configurations
sudo tar -czf crowdsec-backup-$(date +%F).tar.gz /etc/crowdsec/
```

3. **Security Hardening:**
```bash
# Set proper permissions
sudo chmod 600 /etc/crowdsec/local_api_credentials.yaml
sudo chown -R crowdsec:crowdsec /etc/crowdsec/
```

## Integration Examples {#integration-examples}

### Slack Integration {#slack-integration}

Create `/etc/crowdsec/notifications/slack.yaml`:

```yaml
type: slack
name: slack_notification
log_level: info
api_url: "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
format: |
  🚨 *CrowdSec Alert*
  *IP*: {{.IP}}
  *Scenario*: {{.Scenario}}
  *Country*: {{.Country}}
  *AS*: {{.ASNumber}} {{.ASName}}
```

### Custom API Integration {#api-integration}

```bash
# Get API credentials
sudo cscli bouncers add custom-integration

# Example curl command for API interaction
curl -H "X-Api-Key: ${API_KEY}" http://localhost:8080/v1/decisions
```

## Community Resources {#community-resources}

- [Official Documentation](https://docs.crowdsec.net/)
- [CrowdSec Hub](https://hub.crowdsec.net/)
- [GitHub Repository](https://github.com/crowdsecurity/crowdsec)
- [Community Forum](https://discourse.crowdsec.net/)

## Conclusion {#conclusion}

This guide covers the essential aspects of deploying and managing CrowdSec on Linux systems. For more specific use cases or advanced configurations, refer to the official documentation or community resources.

::: tip Note
Always test configurations in a staging environment before deploying to production. Keep your CrowdSec installation updated and regularly review security decisions and logs.
:::