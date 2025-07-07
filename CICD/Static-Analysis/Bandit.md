---
title: Bandit Security Linter
mermaidTheme: forest
description: Comprehensive guide for integrating Bandit security linter in GitHub Actions CI/CD pipelines
layout: doc
---

# Bandit Security Linter

## Introduction

Bandit is an open-source security linter for Python code, designed to find common security issues in Python applications. It is widely used in DevSecOps pipelines to detect vulnerabilities such as hardcoded passwords, SQL injection risks, and insecure cryptography. Bandit analyzes code patterns and provides actionable insights to improve the security posture of Python applications.

**Why use Bandit?**
- **Focused on Python**: Specifically designed to identify security issues in Python code.
- **Ease of Use**: Simple CLI interface with easy integration into CI/CD pipelines.
- **Customizable**: Allows configuration of rules and severity levels.
- **Comprehensive Reporting**: Generates detailed reports in multiple formats.

## Key Features

1. **Vulnerability Detection**: Identifies a wide range of security vulnerabilities in Python code.
2. **Configurable Rules**: Customize which rules to apply and their severity.
3. **Multiple Output Formats**: Supports JSON, XML, HTML, and SARIF formats for integration with various tools and dashboards.
4. **Integration Friendly**: Easily integrates with CI/CD pipelines, IDEs, and other development tools.

## Installation

### Using Docker
Run Bandit as a Docker container:
```bash
docker run --rm -v $(pwd):/workspace pyupio/bandit -r /workspace -f json -o bandit-report.json
```

### Python Package
Install Bandit using pip:
```bash
pip install bandit[toml]
```

## Basic Usage

### CLI Commands

**Run Bandit on the current directory:**
```bash
bandit -r .
```

**Scan a specific file:**
```bash
bandit -r path/to/your_file.py
```

**Generate a report in JSON format:**
```bash
bandit -r . -f json -o bandit-report.json
```

**Scan with specific severity levels:**
```bash
bandit -r . --severity-level high
```

## Integration with GitHub Actions

### Basic Workflow
```yaml
name: Security Scan with Bandit

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install Bandit
        run: pip install bandit[toml]

      - name: Run Bandit security scan
        run: |
          bandit -r . -f json -o bandit-report.json
          bandit -r . -f html -o bandit-report.html

      - name: Upload Bandit results
        uses: actions/upload-artifact@v4
        with:
          name: bandit-results
          path: |
            bandit-report.json
            bandit-report.html
```

## Best Practices

1. **Fail Fast**: Configure Bandit to fail the pipeline if high-severity vulnerabilities are detected:
   ```bash
   bandit -r . --severity-level high --exit-code 1
   ```

2. **Use .banditignore**: Exclude specific files or directories from being scanned:
   ```plaintext
   # .banditignore
   tests/
   venv/
   ```

3. **Regularly Update**: Keep Bandit and its rules up to date to protect against new vulnerabilities:
   ```bash
   pip install --upgrade bandit
   ```

4. **Combine with Other Tools**: Use Bandit alongside other security tools for comprehensive coverage.

5. **Review and Triage**: Regularly review Bandit reports and triage issues based on your project's risk profile.

## Advanced Configuration

### 1. Custom Rules

You can define custom rules in a configuration file to tailor Bandit's checks to your project's needs.

**Example: Custom configuration in `setup.cfg`**
```ini
[bandit]
exclude_dirs = tests, venv
skips = B101, B110
```

### 2. Reporting and Visualization

Generate and publish reports in various formats for integration with dashboards and reporting tools.

**Example: Generate HTML and JSON reports**
```yaml
- name: Generate comprehensive reports
  run: |
    bandit -r . -f html -o bandit-report.html
    bandit -r . -f json -o bandit-report.json

- name: Upload comprehensive reports
  uses: actions/upload-artifact@v4
  with:
    name: bandit-comprehensive-reports
    path: |
      bandit-report.html
      bandit-report.json
```

### 3. False Positive Management

Manage false positives by excluding specific issues or files from scans.

**Example: Exclude specific issues in `.banditignore`**
```ini
[bandit]
# Use .banditignore for files/directories
exclude_dirs = ['/tests', '/venv']

# Use skips for specific rules that don't apply to your project
skips = ['B101']  # Skip assert_used if using assertions intentionally
```

### 4. Dashboard Integration

Integrate Bandit with security dashboards for centralized monitoring and alerting.

**Example: Python script to send metrics to a dashboard**
```python
# dashboard_integration.py
import json
import requests
from datetime import datetime

def send_metrics_to_dashboard(bandit_report_path, dashboard_url, api_key):
    """Send Bandit metrics to security dashboard"""
    with open(bandit_report_path, 'r') as f:
        report = json.load(f)
    
    metrics = {
        'timestamp': datetime.utcnow().isoformat(),
        'total_issues': len(report.get('results', [])),
        'high_severity': len([r for r in report.get('results', []) if r.get('issue_severity') == 'HIGH']),
        'medium_severity': len([r for r in report.get('results', []) if r.get('issue_severity') == 'MEDIUM']),
        'low_severity': len([r for r in report.get('results', []) if r.get('issue_severity') == 'LOW']),
        'files_scanned': report.get('metrics', {}).get('_totals', {}).get('nosec', 0),
        'lines_of_code': report.get('metrics', {}).get('_totals', {}).get('loc', 0)
    }
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(f'{dashboard_url}/api/security-metrics', 
                           json=metrics, headers=headers)
    return response.status_code == 200
```

## Enterprise Integration

### Jenkins Pipeline Integration

Integrate Bandit into Jenkins pipelines for continuous security analysis.

**Example: Jenkinsfile stage for Bandit scan**
```groovy
pipeline {
    agent any
    
    stages {
        stage('Security Scan') {
            steps {
                script {
                    // Install Bandit
                    sh 'pip install bandit[toml]'
                    
                    // Run Bandit scan
                    sh '''
                        bandit -r . -f json -o bandit-report.json
                        bandit -r . -f xml -o bandit-report.xml
                    '''
                    
                    // Process results
                    def report = readJSON file: 'bandit-report.json'
                    def highIssues = report.results.findAll { it.issue_severity == 'HIGH' }
                    
                    if (highIssues.size() > 0) {
                        error("High severity security issues found: ${highIssues.size()}")
                    }
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: '.',
                        reportFiles: 'bandit-report.html',
                        reportName: 'Bandit Security Report'
                    ])
                }
            }
        }
    }
}
```

### Azure DevOps Integration

Integrate Bandit into Azure DevOps pipelines for continuous security analysis.

**Example: azure-pipelines.yml configuration for Bandit**
```yaml
trigger:
- main
- develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  pythonVersion: '3.11'

stages:
- stage: SecurityScan
  displayName: 'Security Scanning'
  jobs:
  - job: BanditScan
    displayName: 'Bandit Security Analysis'
    steps:
    - task: UsePythonVersion@0
      inputs:
        versionSpec: '$(pythonVersion)'
      displayName: 'Use Python $(pythonVersion)'

    - script: |
        pip install bandit[toml]
        bandit -r . -f json -o $(Build.ArtifactStagingDirectory)/bandit-report.json
        bandit -r . -f html -o $(Build.ArtifactStagingDirectory)/bandit-report.html
      displayName: 'Run Bandit Security Scan'
      continueOnError: true

    - task: PublishBuildArtifacts@1
      inputs:
        pathToPublish: '$(Build.ArtifactStagingDirectory)'
        artifactName: 'SecurityReports'
      displayName: 'Publish Security Reports'

    - script: |
        python -c "
        import json
        with open('$(Build.ArtifactStagingDirectory)/bandit-report.json', 'r') as f:
            report = json.load(f)
        high_issues = [r for r in report.get('results', []) if r.get('issue_severity') == 'HIGH']
        if len(high_issues) > 0:
            print(f'##vso[task.logissue type=error]High severity issues found: {len(high_issues)}')
            exit(1)
        "
      displayName: 'Check for High Severity Issues'
```

## Monitoring and Alerting

### Security Trend Analysis

Analyze security trends over time to identify patterns and improve security posture.

**Example: Python script for trend analysis**
```python
# trend_analysis.py
import json
import sqlite3
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

class BanditTrendAnalyzer:
    def __init__(self, db_path='bandit_trends.db'):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                total_issues INTEGER,
                high_severity INTEGER,
                medium_severity INTEGER,
                low_severity INTEGER,
                files_scanned INTEGER,
                commit_hash TEXT
            )
        ''')
        conn.commit()
        conn.close()
    
    def record_scan(self, report_path, commit_hash=None):
        with open(report_path, 'r') as f:
            report = json.load(f)
        
        results = report.get('results', [])
        metrics = {
            'timestamp': datetime.utcnow().isoformat(),
            'total_issues': len(results),
            'high_severity': len([r for r in results if r.get('issue_severity') == 'HIGH']),
            'medium_severity': len([r for r in results if r.get('issue_severity') == 'MEDIUM']),
            'low_severity': len([r for r in results if r.get('issue_severity') == 'LOW']),
            'files_scanned': report.get('metrics', {}).get('_totals', {}).get('nosec', 0),
            'commit_hash': commit_hash
        }
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO scans (timestamp, total_issues, high_severity, medium_severity, 
                             low_severity, files_scanned, commit_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            metrics['timestamp'], metrics['total_issues'], metrics['high_severity'],
            metrics['medium_severity'], metrics['low_severity'], 
            metrics['files_scanned'], metrics['commit_hash']
        ))
        conn.commit()
        conn.close()
    
    def generate_trend_report(self, days=30):
        """Generate trend analysis for the last N days"""
        since = (datetime.utcnow() - timedelta(days=days)).isoformat()
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT timestamp, total_issues, high_severity, medium_severity, low_severity
            FROM scans 
            WHERE timestamp > ?
            ORDER BY timestamp
        ''', (since,))
        
        data = cursor.fetchall()
        conn.close()
        
        if not data:
            return "No data available for trend analysis"
        
        # Create trend visualization
        timestamps = [row[0] for row in data]
        total_issues = [row[1] for row in data]
        high_severity = [row[2] for row in data]
        
        plt.figure(figsize=(12, 6))
        plt.plot(timestamps, total_issues, label='Total Issues', marker='o')
        plt.plot(timestamps, high_severity, label='High Severity', marker='s', color='red')
        plt.title(f'Security Issues Trend (Last {days} days)')
        plt.xlabel('Date')
        plt.ylabel('Number of Issues')
        plt.legend()
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig('security_trend.png')
        plt.close()
        
        return data
```

### Alerting System

Set up alerting for critical security issues detected by Bandit.

**Example: Python script for sending alerts**
```python
# alerting.py
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class SecurityAlerting:
    def __init__(self, smtp_server, smtp_port, username, password):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.username = username
        self.password = password
    
    def check_and_alert(self, report_path, thresholds=None):
        if thresholds is None:
            thresholds = {'high': 0, 'medium': 5, 'low': 20}
        
        with open(report_path, 'r') as f:
            report = json.load(f)
        
        results = report.get('results', [])
        counts = {
            'high': len([r for r in results if r.get('issue_severity') == 'HIGH']),
            'medium': len([r for r in results if r.get('issue_severity') == 'MEDIUM']),
            'low': len([r for r in results if r.get('issue_severity') == 'LOW'])
        }
        
        alerts = []
        for severity, count in counts.items():
            if count > thresholds[severity]:
                alerts.append({
                    'severity': severity,
                    'count': count,
                    'threshold': thresholds[severity]
                })
        
        if alerts:
            self.send_alert(alerts, counts)
        
        return alerts
    
    def send_alert(self, alerts, counts):
        msg = MIMEMultipart()
        msg['From'] = self.username
        msg['To'] = 'security-team@company.com'
        msg['Subject'] = '🚨 Security Alert: Bandit Scan Thresholds Exceeded'
        
        body = f"""
        Security scan has detected issues exceeding defined thresholds:
        
        Current counts:
        - High severity: {counts['high']}
        - Medium severity: {counts['medium']}
        - Low severity: {counts['low']}
        
        Threshold violations:
        """
        
        for alert in alerts:
            body += f"\n- {alert['severity'].upper()}: {alert['count']} (threshold: {alert['threshold']})"
        
        body += "\n\nPlease review the security scan results and take appropriate action."
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(self.smtp_server, self.smtp_port)
        server.starttls()
        server.login(self.username, self.password)
        text = msg.as_string()
        server.sendmail(self.username, 'security-team@company.com', text)
        server.quit()
```

## Migration and Adoption Strategies

### Gradual Implementation Plan

```bash
# Phase 1: Assessment (Week 1-2)
# Run Bandit on codebase to understand current state
bandit -r . -f json -o initial-assessment.json

# Analyze results and categorize issues
python analyze_baseline.py initial-assessment.json

# Phase 2: Critical Issues (Week 3-4)
# Focus only on high severity issues
bandit -r . -severity high --exit-code 1

# Phase 3: Medium Priority (Week 5-8)
# Include medium severity issues
bandit -r . -severity medium --exit-code 1

# Phase 4: Full Implementation (Week 9+)
# Include all severity levels
bandit -r . --exit-code 1
```

### Team Training Materials

```python
# training_examples.py
"""
Bandit Training Examples for Development Teams
"""

# Example 1: Hardcoded Password (B105, B106, B107)
# WRONG:
password = "admin123"  # This will be flagged by Bandit

# RIGHT:
import os
password = os.environ.get('PASSWORD')

# Example 2: SQL Injection Risk (B608)
# WRONG:
query = f"SELECT * FROM users WHERE id = {user_id}"  # Dangerous

# RIGHT:
query = "SELECT * FROM users WHERE id = %s"
cursor.execute(query, (user_id,))

# Example 3: Insecure Randomness (B311)
# WRONG:
import random
token = random.random()  # Not cryptographically secure

# RIGHT:
import secrets
token = secrets.token_hex(16)

# Example 4: Shell Injection (B602, B603)
# WRONG:
import subprocess
subprocess.call(f"ls {user_input}", shell=True)  # Dangerous

# RIGHT:
import subprocess
subprocess.call(["ls", user_input])  # Safe

# Example 5: Weak Cryptography (B303, B304, B305)
# WRONG:
import hashlib
hash_value = hashlib.md5(data).hexdigest()  # Weak algorithm

# RIGHT:
import hashlib
hash_value = hashlib.sha256(data).hexdigest()  # Strong algorithm
```

## Performance Optimization

### Large Codebase Optimization

```bash
# For large codebases, use selective scanning
# Scan only changed files in CI/CD
git diff --name-only HEAD~1 HEAD | grep "\.py$" | xargs bandit

# Use parallel processing
bandit -r . --processes 4

# Exclude large directories that don't need scanning
bandit -r . --exclude /tests,/migrations,/static,/media
```

### Memory and Time Optimization

```yaml
# Optimized CI/CD configuration
- name: Optimized Bandit Scan
  run: |
    # Use memory-efficient scanning for large repos
    find . -name "*.py" -not -path "./venv/*" -not -path "./env/*" | \
    split -l 100 - files_batch_
    
    for batch in files_batch_*; do
      bandit $(cat $batch) -f json >> bandit_partial.json
    done
    
    # Combine results
    python combine_bandit_results.py bandit_partial.json > bandit-final.json
```

## Conclusion

Bandit provides essential security analysis specifically tailored for Python applications. Its deep understanding of Python-specific security patterns makes it an invaluable tool for any Python development team implementing DevSecOps practices.

**Key takeaways:**
- Start with high-severity issues and gradually expand coverage
- Use baseline files to track security improvements over time
- Integrate with existing development workflows for maximum adoption
- Combine with other security tools for comprehensive coverage
- Regularly update rules and configurations based on new security threats

**Next steps:**
1. Implement Bandit in your CI/CD pipeline
2. Establish security thresholds appropriate for your project
3. Train your development team on common Python security issues
4. Set up monitoring and alerting for security trend analysis
5. Regular review and update of security policies and configurations

For more information and advanced configurations, visit the [Bandit Documentation](https://bandit.readthedocs.io/).