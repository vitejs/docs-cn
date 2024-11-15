Sure, here's the updated guide with the commands for both `docker-compose` and `docker compose`:

---
layout: doc
title: DevSecOps Guide with Docker
description: Setting up a configurable and automated DevSecOps environment with Docker

---

## Introduction

This DevSecOps training aims to set up a containerized and configurable environment using Docker. We will use a `docker-compose.yml` file to orchestrate the various services required for our project. All configuration parameters will be stored in a `.env` file to make them easily modifiable.

## Prerequisites

- Docker installed on your machine
- Basic knowledge of Docker and docker-compose

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
# docker-compose.yml
version: '3.8'
services:

  postgres:
    image: postgres:12
    env_file: .env
    volumes:
      - ./volumes/postgres:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    env_file: .env
    ports:
      - "8000:8000"
    depends_on:
      - postgres

volumes:
  postgres:
    driver: local
    name: postgres-data
```

:::tip
Notice that the configuration variables are defined in the `.env` file and used in the `docker-compose.yml` file. This allows the environment to be easily configurable.
:::

## Automatic Updates with Watchtower

To automate the update of the Docker images used, we will add the `watchtower` service to our configuration:

```yaml
# docker-compose.yml
version: '3.8'
services:

  # ... other services ...

  watchtower:
    image: containrrr/watchtower:latest
    container_name: watchtower
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --schedule "0 0 4 * * *" --cleanup
```

:::tip
The `watchtower` service monitors the Docker images used by the other services and automatically updates them if a new version is available. It is configured to run every day at 4:00 AM.
:::

## Usage

To start the environment, use one of the following commands in the project directory:

```bash [APT]
docker-compose up -d
```
```bash [Plugin]
docker compose up -d
```

This will start all the services defined in the `docker-compose.yml` file.

To stop the environment, use one of the following commands:

```bash [APT]
docker-compose down
```
```bash [Plugin]
docker compose down
```

## Conclusion

With this configuration, you have a highly configurable and automated DevSecOps environment. All configuration parameters are stored in the `.env` file, making them easy to modify. Additionally, the use of Watchtower allows you to keep your Docker images up-to-date in a transparent manner.

Feel free to expand this configuration by adding other services (applications, security tools, etc.) according to your needs.