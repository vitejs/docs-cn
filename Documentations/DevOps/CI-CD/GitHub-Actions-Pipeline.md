---
title: Setting Up GitHub Actions Pipelines
description: A comprehensive guide to implementing CI/CD with GitHub Actions
---

# Setting Up GitHub Actions Pipelines

<DifficultyIndicator 
  :difficulty="2" 
  label="GitHub Actions Setup" 
  time="2-4 hours" 
  :prerequisites="['GitHub repository', 'Basic YAML knowledge', 'Understanding of CI/CD concepts']"
>
  Setting up basic GitHub Actions workflows is relatively straightforward. The complexity increases when implementing matrix builds, custom actions, or integrating with complex deployment targets.
</DifficultyIndicator>

## Introduction

GitHub Actions provides a powerful and flexible way to automate your software development workflows directly within your GitHub repository. This guide covers the setup and configuration of effective CI/CD pipelines using GitHub Actions.

## Basic Workflow Structure

GitHub Actions workflows are defined in YAML files stored in the `.github/workflows` directory of your repository:

```yaml
name: Basic CI Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
```

## Workflow Triggers

GitHub Actions workflows can be triggered by various events:

```yaml
on:
  push:
    branches: [ main, develop ]
    paths-ignore:
      - '**.md'
  pull_request:
    types: [opened, synchronize, reopened]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:  # Manual trigger
```

## Environment Secrets

Secure sensitive information using GitHub Secrets:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: ./deploy.sh
        env:
          API_TOKEN: ${{ secrets.API_TOKEN }}
          DATABASE_PASSWORD: ${{ secrets.DATABASE_PASSWORD }}
```

## Matrix Builds

Test across multiple environments using matrix strategy:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]
        os: [ubuntu-latest, windows-latest, macos-latest]
        
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        
    - run: npm ci
    - run: npm test
```

## Artifacts and Caching

Improve workflow efficiency with artifacts and caching:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          
      - name: Build application
        run: npm run build
        
      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
```

## Deployment Workflows

Example of a complete CI/CD pipeline with deployment stages:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
        
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build application
        run: npm run build
      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
          
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3
      - name: Download build artifact
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
      - name: Deploy to staging
        run: ./deploy.sh staging
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
          
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      - name: Download build artifact
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
      - name: Deploy to production
        run: ./deploy.sh production
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

## Custom Actions

For reusable workflows, create custom actions:

```yaml
# .github/actions/custom-deployment/action.yml
name: 'Custom Deployment'
description: 'Deploys application to specified environment'
inputs:
  environment:
    description: 'Environment to deploy to'
    required: true
    default: 'staging'
  token:
    description: 'Deployment token'
    required: true
runs:
  using: 'composite'
  steps:
    - name: Deploy application
      shell: bash
      run: |
        echo "Deploying to ${{ inputs.environment }}"
        ./scripts/deploy.sh ${{ inputs.environment }} ${{ inputs.token }}
```

Usage:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ./.github/actions/custom-deployment
        with:
          environment: production
          token: ${{ secrets.DEPLOY_TOKEN }}
```

## Security Best Practices

- Use GITHUB_TOKEN with least privilege
- Implement workflow approval gates for production deployments
- Scan code and dependencies for vulnerabilities
- Use specific action versions instead of `@main` or `@master`
