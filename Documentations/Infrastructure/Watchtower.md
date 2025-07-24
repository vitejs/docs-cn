---
layout: doc
title: DevSecOps Guide with Docker
description: Setting up a configurable and automated DevSecOps environment with Docker
mermaidTheme: forest
---

# Watchtower - Automated Container Updates

<DifficultyIndicator 
  :difficulty="2" 
  label="Watchtower Setup" 
  time="30-60 minutes" 
  :prerequisites="['Docker', 'Docker Compose', 'Basic YAML knowledge']"
>
  Setting up Watchtower for automated container updates is relatively straightforward. The main complexity comes from configuring notifications, setting up the update schedule, and ensuring proper container labeling.
</DifficultyIndicator>

## Introduction

This DevSecOps training aims to set up a containerized and configurable environment using Docker. We will use a `docker-compose.yml` file to orchestrate the various services required for our project. All configuration parameters will be stored in a `.env` file to make them easily modifiable.

## Prerequisites

- Docker installed on your machine
- Basic knowledge of Docker and docker-compose
- Discord webhook URL (for notifications)

## Configuration

Let's start by creating a `.env` file at the root of our project to store the configuration variables:

```
# .env
POSTGRES_DB=myapp
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
```

Next, let's create the `docker-compose.yml` file that will define our services:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:12
    env_file: .env
    volumes:
      - ./volumes/postgres:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    labels:
      - "com.centurylinklabs.watchtower.enable=true"

  app:
    build: .
    env_file: .env
    ports:
      - "8000:8000"
    depends_on:
      - postgres
    labels:
      - "com.centurylinklabs.watchtower.enable=true"

  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped
#    command: --schedule "0 0 4 * * *" --cleanup --label-enable
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_INCLUDE_STOPPED=false
      - WATCHTOWER_POLL_INTERVAL=300
      - WATCHTOWER_LABEL_ENABLE=true
      - TZ=Europe/Paris
      - WATCHTOWER_NOTIFICATIONS=shoutrrr
      # For multiple notifications, separate with comma:
      # - WATCHTOWER_NOTIFICATION_URL=discord://webhook_id1/webhook_token1,discord://webhook_id2/webhook_token2
    labels:
      - "com.centurylinklabs.watchtower.enable=false"

volumes:
  postgres:
    driver: local
    name: postgres-data
```

:::tip
Notice the following improvements in this configuration:
1. Services that should be monitored by Watchtower are labeled with `com.centurylinklabs.watchtower.enable=true`
2. Watchtower itself is labeled with `enable=false` to prevent self-updating
3. Discord notifications are configured using webhook URLs
4. The poll interval is set to 300 seconds (5 minutes)
:::

## Watchtower Configuration Explained

### Labels
- `com.centurylinklabs.watchtower.enable=true`: Add this label to containers you want Watchtower to monitor
- `com.centurylinklabs.watchtower.enable=false`: Use this to exclude containers from monitoring

### Environment Variables
- `WATCHTOWER_CLEANUP=true`: Remove old images after updating
- `WATCHTOWER_INCLUDE_STOPPED=false`: Don't update stopped containers
- `WATCHTOWER_POLL_INTERVAL=300`: Check for updates every 5 minutes
- `WATCHTOWER_LABEL_ENABLE=true`: Only monitor containers with the enable label
- `TZ=Europe/Paris`: Set timezone for scheduling
- `WATCHTOWER_NOTIFICATIONS=shoutrrr`: Enable notifications using the Shoutrrr notification system
- `WATCHTOWER_NOTIFICATION_URL`: Discord webhook URL for notifications

## Discord Notifications Setup

1. In your Discord server, go to Server Settings > Integrations > Create Webhook
2. Copy the webhook URL
3. Convert the webhook URL to the format: `discord://webhook_id/webhook_token`
4. Add it to the `WATCHTOWER_NOTIFICATION_URL` environment variable

## Usage

To start the environment, use the following command in the project directory:

```bash
docker compose up -d
```

To stop the environment:

```bash
docker compose down
```

## Monitoring Updates

With this configuration:
- Watchtower will check for updates every 5 minutes
- Only containers with the `enable=true` label will be monitored
- You'll receive Discord notifications when:
  - Updates are available
  - Updates are successfully applied
  - Any errors occur during updates

## Conclusion

This configuration provides a secure and automated DevSecOps environment with:
- Selective container monitoring using labels
- Automated cleanup of old images
- Real-time Discord notifications for updates and errors
- Configurable polling intervals
- Timezone-aware scheduling
