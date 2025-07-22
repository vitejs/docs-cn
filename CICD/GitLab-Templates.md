---
title: GitLab CI Templates
mermaidTheme: forest
description: Ready-to-use GitLab CI/CD pipeline templates for DevSecOps
layout: doc
---

# GitLab CI Templates

## CI/CD Pipeline Overview

Below is a visual representation of a typical CI/CD pipeline using GitLab CI/CD:

```mermaid
graph TD
    A[Code Commit / Merge Request] --> B[Trigger Pipeline]
    B --> C[Checkout Code]
    C --> D[Install Dependencies]
    D --> E[Run Tests]
    E --> F[Build Artifacts]
    F --> G{Tests Passed?}
    G -- Yes --> H[Upload Artifacts]
    H --> I[Deploy to Staging]
    I --> J{Staging Approval}
    J -- Approved --> K[Deploy to Production]
    G -- No --> L[Fail Pipeline]
    J -- Rejected --> L
```

::: tip
This diagram shows the main stages: code commit, pipeline trigger, testing, building, artifact handling, and deployment with approval gates.
:::

## Introduction

This collection provides ready-to-use GitLab CI/CD pipeline templates for various development scenarios in a DevSecOps environment. These templates incorporate GitLab's built-in security scanning and deployment features.

## Node.js Application Template

### Complete DevSecOps Pipeline

```yaml
stages:
  - security
  - build
  - test
  - deploy

variables:
  NODE_VERSION: "18"
  DOCKER_IMAGE: "node:18-alpine"
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

# Include GitLab security templates
include:
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Dependency-Scanning.gitlab-ci.yml
  - template: Security/Container-Scanning.gitlab-ci.yml
  - template: Security/Secret-Detection.gitlab-ci.yml

# Cache configuration
cache:
  key:
    files:
      - package-lock.json
  paths:
    - node_modules/
    - .npm/

# Security Stage
secret_detection:
  stage: security

sast:
  stage: security

dependency_scanning:
  stage: security

# Build Stage
build:
  stage: build
  image: $DOCKER_IMAGE
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_BRANCH == "develop"'

# Test Stage
test:unit:
  stage: test
  image: $DOCKER_IMAGE
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run test:coverage
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
      junit: junit.xml
    paths:
      - coverage/
    expire_in: 1 week
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_BRANCH == "develop"'

test:lint:
  stage: test
  image: $DOCKER_IMAGE
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run lint
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_BRANCH == "develop"'

test:e2e:
  stage: test
  image: $DOCKER_IMAGE
  services:
    - name: postgres:13
      alias: postgres
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: test_user
    POSTGRES_PASSWORD: test_pass
    DATABASE_URL: "postgresql://test_user:test_pass@postgres:5432/test_db"
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - cypress/screenshots/
      - cypress/videos/
    expire_in: 1 week
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_BRANCH == "develop"'

# Docker Build
docker:build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  variables:
    IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_BRANCH == "develop"'

# Container Scanning
container_scanning:
  stage: test
  needs: ["docker:build"]
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_BRANCH == "develop"'

# Deploy to Staging
deploy:staging:
  stage: deploy
  image: alpine:latest
  environment:
    name: staging
    url: https://staging.example.com
  before_script:
    - apk add --no-cache curl
  script:
    - echo "Deploying $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA to staging"
    - curl -X POST "$STAGING_DEPLOY_WEBHOOK" -H "Authorization: Bearer $STAGING_DEPLOY_TOKEN"
  rules:
    - if: '$CI_COMMIT_BRANCH == "develop"'

# Deploy to Production
deploy:production:
  stage: deploy
  image: alpine:latest
  environment:
    name: production
    url: https://production.example.com
  before_script:
    - apk add --no-cache curl
  script:
    - echo "Deploying $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA to production"
    - curl -X POST "$PRODUCTION_DEPLOY_WEBHOOK" -H "Authorization: Bearer $PRODUCTION_DEPLOY_TOKEN"
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
  when: manual
  allow_failure: false

# Notifications
notify:slack:
  stage: .post
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - |
      if [ "$CI_JOB_STATUS" == "success" ]; then
        EMOJI=":white_check_mark:"
        COLOR="good"
      else
        EMOJI=":x:"
        COLOR="danger"
      fi
      
      curl -X POST -H 'Content-type: application/json' \
        --data "{
          \"text\":\"$EMOJI Pipeline $CI_PIPELINE_STATUS\",
          \"attachments\":[{
            \"color\":\"$COLOR\",
            \"fields\":[{
              \"title\":\"Project\",
              \"value\":\"$CI_PROJECT_NAME\",
              \"short\":true
            },{
              \"title\":\"Branch\",
              \"value\":\"$CI_COMMIT_REF_NAME\",
              \"short\":true
            },{
              \"title\":\"Commit\",
              \"value\":\"$CI_COMMIT_SHA\",
              \"short\":true
            }]
          }]
        }" \
        $SLACK_WEBHOOK_URL
  rules:
    - when: always
```

## Python Application Template

### Django/Flask DevSecOps Pipeline

```yaml
stages:
  - security
  - build
  - test
  - deploy

variables:
  PYTHON_VERSION: "3.11"
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

# Include GitLab security templates
include:
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Dependency-Scanning.gitlab-ci.yml
  - template: Security/Secret-Detection.gitlab-ci.yml

# Cache configuration
cache:
  key:
    files:
      - requirements.txt
  paths:
    - .cache/pip/
    - venv/

# Security Stage
sast:
  stage: security

dependency_scanning:
  stage: security

secret_detection:
  stage: security

# Custom Security Checks
security:bandit:
  stage: security
  image: python:$PYTHON_VERSION
  before_script:
    - pip install bandit
  script:
    - bandit -r . -f json -o bandit-report.json
  artifacts:
    reports:
      junit: bandit-report.json
    paths:
      - bandit-report.json
    expire_in: 1 week

security:safety:
  stage: security
  image: python:$PYTHON_VERSION
  before_script:
    - pip install safety
  script:
    - safety check --json --output safety-report.json
  artifacts:
    paths:
      - safety-report.json
    expire_in: 1 week

# Build Stage
build:
  stage: build
  image: python:$PYTHON_VERSION
  before_script:
    - python -V
    - pip install virtualenv
    - virtualenv venv
    - source venv/bin/activate
  script:
    - pip install -r requirements.txt
    - python -m py_compile **/*.py
  artifacts:
    paths:
      - venv/
    expire_in: 1 hour

# Test Stage
test:unit:
  stage: test
  image: python:$PYTHON_VERSION
  before_script:
    - source venv/bin/activate
  script:
    - pip install pytest pytest-cov
    - pytest --cov=. --cov-report=xml --cov-report=html
  coverage: '/TOTAL.+ ([0-9]{1,3}%)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
    paths:
      - htmlcov/
    expire_in: 1 week

test:lint:
  stage: test
  image: python:$PYTHON_VERSION
  before_script:
    - source venv/bin/activate
  script:
    - pip install flake8 black isort
    - flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
    - black --check .
    - isort --check-only .

# Docker Build
docker:build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  variables:
    IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_BRANCH == "develop"'

# Deploy Stage
deploy:staging:
  stage: deploy
  image: python:$PYTHON_VERSION
  environment:
    name: staging
    url: https://staging-app.example.com
  script:
    - echo "Deploying to staging environment"
    - pip install fabric
    - fab deploy:staging
  rules:
    - if: '$CI_COMMIT_BRANCH == "develop"'

deploy:production:
  stage: deploy
  image: python:$PYTHON_VERSION
  environment:
    name: production
    url: https://app.example.com
  script:
    - echo "Deploying to production environment"
    - pip install fabric
    - fab deploy:production
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
  when: manual
```

## Go Application Template

### Microservice DevSecOps Pipeline

```yaml
stages:
  - security
  - test
  - build
  - deploy

variables:
  GO_VERSION: "1.21"
  GOCACHE: "$CI_PROJECT_DIR/.cache/go-cache"
  GOMODCACHE: "$CI_PROJECT_DIR/.cache/go-mod"

# Include GitLab security templates
include:
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Dependency-Scanning.gitlab-ci.yml
  - template: Security/Secret-Detection.gitlab-ci.yml

# Cache configuration
cache:
  key:
    files:
      - go.sum
  paths:
    - .cache/go-cache/
    - .cache/go-mod/

# Security Stage
sast:
  stage: security

dependency_scanning:
  stage: security

secret_detection:
  stage: security

security:gosec:
  stage: security
  image: golang:$GO_VERSION
  script:
    - go install github.com/securecodewarrior/sast-scan/gosec@latest
    - gosec -fmt sarif -out gosec-report.sarif ./...
  artifacts:
    reports:
      sast: gosec-report.sarif
    paths:
      - gosec-report.sarif
    expire_in: 1 week

# Test Stage
test:unit:
  stage: test
  image: golang:$GO_VERSION
  before_script:
    - export GOCACHE="$CI_PROJECT_DIR/.cache/go-cache"
    - export GOMODCACHE="$CI_PROJECT_DIR/.cache/go-mod"
  script:
    - go mod download
    - go vet ./...
    - go test -race -coverprofile=coverage.out -covermode=atomic ./...
    - go tool cover -html=coverage.out -o coverage.html
  coverage: '/coverage: \d+\.\d+% of statements/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.out
    paths:
      - coverage.html
    expire_in: 1 week

test:benchmark:
  stage: test
  image: golang:$GO_VERSION
  before_script:
    - export GOCACHE="$CI_PROJECT_DIR/.cache/go-cache"
    - export GOMODCACHE="$CI_PROJECT_DIR/.cache/go-mod"
  script:
    - go mod download
    - go test -bench=. -benchmem ./...
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

# Build Stage
build:binary:
  stage: build
  image: golang:$GO_VERSION
  before_script:
    - export GOCACHE="$CI_PROJECT_DIR/.cache/go-cache"
    - export GOMODCACHE="$CI_PROJECT_DIR/.cache/go-mod"
  script:
    - go mod download
    - CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .
  artifacts:
    paths:
      - main
    expire_in: 1 hour

docker:build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  variables:
    IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
  needs: ["build:binary"]
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_BRANCH == "develop"'

# Deploy Stage
deploy:staging:
  stage: deploy
  image: alpine:latest
  environment:
    name: staging
    url: https://api-staging.example.com
  script:
    - echo "Deploying Go microservice to staging"
    - apk add --no-cache curl
    - curl -X POST "$STAGING_DEPLOY_WEBHOOK"
  rules:
    - if: '$CI_COMMIT_BRANCH == "develop"'

deploy:production:
  stage: deploy
  image: alpine:latest
  environment:
    name: production
    url: https://api.example.com
  script:
    - echo "Deploying Go microservice to production"
    - apk add --no-cache curl
    - curl -X POST "$PRODUCTION_DEPLOY_WEBHOOK"
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
  when: manual
```

## Infrastructure as Code Template

### Terraform DevSecOps Pipeline

```yaml
stages:
  - validate
  - security
  - plan
  - deploy

variables:
  TF_VERSION: "1.6.0"
  TF_IN_AUTOMATION: "true"
  TF_ROOT: ${CI_PROJECT_DIR}/terraform

# Include GitLab security templates
include:
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Secret-Detection.gitlab-ci.yml

# Cache Terraform
cache:
  key: terraform
  paths:
    - ${TF_ROOT}/.terraform
    - ${TF_ROOT}/.terraform.lock.hcl

# Validation Stage
tf:validate:
  stage: validate
  image:
    name: hashicorp/terraform:$TF_VERSION
    entrypoint: [""]
  before_script:
    - cd ${TF_ROOT}
    - terraform --version
    - terraform init -backend=false
  script:
    - terraform validate
    - terraform fmt -check=true -diff=true

# Security Stage
sast:
  stage: security

secret_detection:
  stage: security

security:checkov:
  stage: security
  image: bridgecrew/checkov:latest
  script:
    - checkov -d ${TF_ROOT} --framework terraform --output cli --output junitxml --output-file-path console,checkov-report.xml
  artifacts:
    reports:
      junit: checkov-report.xml
    paths:
      - checkov-report.xml
    expire_in: 1 week

security:tfsec:
  stage: security
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
    - curl -s https://raw.githubusercontent.com/aquasecurity/tfsec/master/scripts/install_linux.sh | sh
  script:
    - tfsec ${TF_ROOT} --format junit --out tfsec-report.xml
  artifacts:
    reports:
      junit: tfsec-report.xml
    paths:
      - tfsec-report.xml
    expire_in: 1 week

# Plan Stage
tf:plan:staging:
  stage: plan
  image:
    name: hashicorp/terraform:$TF_VERSION
    entrypoint: [""]
  before_script:
    - cd ${TF_ROOT}
    - terraform init
  script:
    - terraform workspace select staging || terraform workspace new staging
    - terraform plan -var-file="staging.tfvars" -out=staging.tfplan
  artifacts:
    paths:
      - ${TF_ROOT}/staging.tfplan
    expire_in: 1 hour
  rules:
    - if: '$CI_COMMIT_BRANCH == "develop"'

tf:plan:production:
  stage: plan
  image:
    name: hashicorp/terraform:$TF_VERSION
    entrypoint: [""]
  before_script:
    - cd ${TF_ROOT}
    - terraform init
  script:
    - terraform workspace select production || terraform workspace new production
    - terraform plan -var-file="production.tfvars" -out=production.tfplan
  artifacts:
    paths:
      - ${TF_ROOT}/production.tfplan
    expire_in: 1 hour
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

# Deploy Stage
tf:apply:staging:
  stage: deploy
  image:
    name: hashicorp/terraform:$TF_VERSION
    entrypoint: [""]
  environment:
    name: staging
  before_script:
    - cd ${TF_ROOT}
    - terraform init
  script:
    - terraform workspace select staging
    - terraform apply -auto-approve staging.tfplan
  needs: ["tf:plan:staging"]
  rules:
    - if: '$CI_COMMIT_BRANCH == "develop"'

tf:apply:production:
  stage: deploy
  image:
    name: hashicorp/terraform:$TF_VERSION
    entrypoint: [""]
  environment:
    name: production
  before_script:
    - cd ${TF_ROOT}
    - terraform init
  script:
    - terraform workspace select production
    - terraform apply -auto-approve production.tfplan
  needs: ["tf:plan:production"]
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
  when: manual
```

## Kubernetes Deployment Template

### GitOps with ArgoCD Integration

```yaml
stages:
  - build
  - security
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"
  KUBECTL_VERSION: "1.28.0"
  HELM_VERSION: "3.13.0"

# Include GitLab security templates
include:
  - template: Security/Container-Scanning.gitlab-ci.yml
  - template: Security/SAST.gitlab-ci.yml

# Build Stage
docker:build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  variables:
    IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
    - echo "IMAGE_TAG=$IMAGE_TAG" > docker.env
  artifacts:
    reports:
      dotenv: docker.env

# Security Stage
container_scanning:
  stage: security
  needs: ["docker:build"]

# Deploy Stage
deploy:update-manifests:
  stage: deploy
  image: alpine/git:latest
  before_script:
    - apk add --no-cache yq
  script:
    - git clone https://gitlab-ci-token:${CI_JOB_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_NAMESPACE}/k8s-manifests.git
    - cd k8s-manifests
    - yq eval '.spec.template.spec.containers[0].image = "'$IMAGE_TAG'"' -i manifests/deployment.yaml
    - git config user.email "ci@gitlab.com"
    - git config user.name "GitLab CI"
    - git add manifests/deployment.yaml
    - git commit -m "Update image to $IMAGE_TAG"
    - git push origin main
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

deploy:helm:staging:
  stage: deploy
  image: alpine/helm:$HELM_VERSION
  before_script:
    - apk add --no-cache curl
    - curl -LO "https://dl.k8s.io/release/v$KUBECTL_VERSION/bin/linux/amd64/kubectl"
    - chmod +x kubectl && mv kubectl /usr/local/bin/
  script:
    - helm upgrade --install myapp ./helm/myapp \
        --namespace staging \
        --set image.tag=$CI_COMMIT_SHA \
        --set environment=staging
  environment:
    name: staging
    url: https://staging.k8s.example.com
  rules:
    - if: '$CI_COMMIT_BRANCH == "develop"'

deploy:helm:production:
  stage: deploy
  image: alpine/helm:$HELM_VERSION
  before_script:
    - apk add --no-cache curl
    - curl -LO "https://dl.k8s.io/release/v$KUBECTL_VERSION/bin/linux/amd64/kubectl"
    - chmod +x kubectl && mv kubectl /usr/local/bin/
  script:
    - helm upgrade --install myapp ./helm/myapp \
        --namespace production \
        --set image.tag=$CI_COMMIT_SHA \
        --set environment=production
  environment:
    name: production
    url: https://app.k8s.example.com
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
  when: manual
```

Educational note:
- GitLab CI templates leverage GitLab's built-in security scanning capabilities
- Use GitLab's Auto DevOps features for automatic pipeline generation
- Take advantage of GitLab's environment management and deployment tracking
- Consider using GitLab's Review Apps for dynamic staging environments
