---
layout: doc
title: Comprehensive Debian Hardening Guide for DevSecOps
description: A detailed guide on hardening Debian Linux systems with a DevSecOps approach, covering system security, access controls, network security, and monitoring.
---

## Introduction

Securing a Linux Debian system is crucial to protect against potential threats and ensure the overall integrity of the system. This tutorial will cover various hardening techniques to enhance the security of a Debian-based Linux system.

## Secure Package Management

1. **Keep the System Up-to-Date**: Regularly update the system by running the following commands:
   ```
   sudo apt-get update
   sudo apt-get upgrade
   ```
   This ensures that the system is equipped with the latest security patches and bug fixes.

2. **Verify Package Integrity**: Enable package signature verification to ensure the integrity of installed packages. Edit the `/etc/apt/apt.conf.d/99-security` file and add the following lines:
   ```
   APT::Get::AllowUnauthenticated "false";
   Acquire::AllowInsecureRepositories "false";
   ```

3. **Manage Installed Packages**: Regularly review the installed packages and remove any unnecessary or unused software. You can use the following command to list all installed packages:
   ```
   sudo apt list --installed
   ```
   Then, remove any unwanted packages using the `sudo apt-get remove <package_name>` command.

## Secure Boot Process

1. **Secure GRUB**: Protect the GRUB bootloader by setting a password. Edit the `/etc/grub.d/40_custom` file and add the following lines:
   ```
   set superusers="grubroot"
   password_pbkdf2 grubroot grub.pbkdf2.sha512.10000.2F92753EF2031D53922ABE74.....C4B847CA5E7648C90E708A4988C69755995E08B5B7FA1591E7C550C16C33A7CD4FCEE2
   ```
   Then, run `sudo update-grub` to apply the changes.

2. **Disable USB Boot**: If the system does not require USB boot, you can disable it by adding the following line to the `/etc/default/grub` file:
   ```
   GRUB_CMDLINE_LINUX="enforcing=1 selinux=1 audit=1 audit_backlog_limit=8192 uefi_disable_pci_firmware_video=1"
   ```
   Then, run `sudo update-grub` to apply the changes.

## Secure User Management

1. **Disable Root Login**: Disable direct root login by setting `PermitRootLogin no` in the `/etc/ssh/sshd_config` file.

2. **Use Strong Passwords**: Enforce strong password policies by configuring the `libpam-cracklib` package and editing the `/etc/pam.d/common-password` file.

3. **Limit User Access**: Use the `sudo` command to grant limited administrative privileges to users instead of sharing the root password. Configure the `/etc/sudoers` file to manage user permissions.

4. **Disable Unused Accounts**: Review the list of user accounts and disable any unused or unnecessary accounts.

## Secure Network Configuration

1. **Configure Firewall**: Install and configure the `ufw` (Uncomplicated Firewall) to control inbound and outbound network traffic. Enable the firewall and allow only necessary ports and services.

2. **Disable Unnecessary Services**: Identify and disable any unnecessary network services running on the system. You can use the `systemctl` command to manage system services.

3. **Secure SSH Configuration**: Customize the SSH server configuration in the `/etc/ssh/sshd_config` file. Disable password-based authentication, allow only specific users or groups, and configure other security-related options.

4. **Implement Network Monitoring**: Consider installing a network intrusion detection system (NIDS) like Snort or Suricata to monitor network traffic and detect any suspicious activities.

## Secure File System and Permissions

1. **Secure File Permissions**: Review and adjust the file permissions to ensure that only authorized users and processes have the necessary access. Use the `chmod`, `chown`, and `chgrp` commands to manage file permissions.

2. **Enable Filesystem Encryption**: Encrypt the entire root filesystem or specific partitions using LUKS (Linux Unified Key Setup) to protect sensitive data.

3. **Secure Sensitive Files**: Identify and secure sensitive configuration files, such as `/etc/shadow`, `/etc/sudoers`, and `/etc/ssh/sshd_config`, by restricting access to only authorized users or processes.

4. **Implement Logging and Auditing**: Enable comprehensive logging and auditing to monitor system activities and detect any suspicious events. Configure the `auditd` service and review the log files regularly.

## Secure Application Configuration

1. **Review and Harden Web Server**: If the system is running a web server (e.g., Apache or Nginx), review and implement security best practices, such as disabling unnecessary modules, configuring SSL/TLS, and implementing web application firewalls.

2. **Secure Database Servers**: If the system is running a database server (e.g., MySQL or PostgreSQL), review and implement security best practices, such as enforcing strong passwords, restricting database access, and keeping the software up-to-date.

3. **Secure Other Services**: Review and harden the configuration of any other services running on the system, such as email servers, FTP servers, or any custom applications.

## Ongoing Maintenance and Monitoring

1. **Regularly Review and Update**: Continuously monitor the system for any new security vulnerabilities or updates, and apply the necessary patches and configurations to keep the system secure.

2. **Implement Vulnerability Scanning**: Use vulnerability scanning tools, such as Nessus or OpenVAS, to regularly assess the system's security posture and identify any potential weaknesses.

3. **Monitor System Logs**: Regularly review system logs to detect any suspicious activities or security incidents, and investigate any anomalies.

4. **Implement Backup and Disaster Recovery**: Establish a comprehensive backup strategy and a disaster recovery plan to ensure the system can be quickly restored in case of a security breach or system failure.



# Comprehensive Debian Hardening Guide for DevSecOps

## Table of Contents
- [Initial Setup](#initial-setup)
- [System Access Security](#system-access-security)
- [File System Security](#file-system-security)
- [Network Security](#network-security)
- [Service Hardening](#service-hardening)
- [Monitoring and Auditing](#monitoring-and-auditing)
- [Container Security](#container-security)

## Initial Setup

### Base System Configuration

1. Create a secure installation:
```bash
# During installation, create separate partitions for:
/boot  # Boot files
/  # Root filesystem
/home  # User files
/var   # Variable data
/tmp   # Temporary files
```

2. Configure secure mount options in `/etc/fstab`:
```bash
# Example secure mount options
/dev/sda1 /boot ext4 defaults,nodev,nosuid,noexec 0 2
/dev/sda2 / ext4 defaults,nodev 0 1
/dev/sda3 /home ext4 defaults,nosuid,nodev 0 2
/dev/sda4 /tmp ext4 defaults,nosuid,nodev,noexec 0 2
/dev/sda5 /var ext4 defaults,nosuid,nodev 0 2
```

### GRUB Security

GRUB (Grand Unified Bootloader) is responsible for loading the operating system on a computer. To prevent unauthorized modifications to the boot process and system settings, you can set a password for GRUB. This ensures that only authorized users can change boot parameters or access recovery options.

1. **Generating the GRUB Password Hash**:
   The command `grub-mkpasswd-pbkdf2` generates a hashed password that can be added to the GRUB configuration. It uses the PBKDF2 algorithm to securely store your password, preventing it from being easily cracked or intercepted.

2. **Setting the Superuser and Password**:
   You need to define a superuser in the GRUB configuration file located in `/etc/grub.d/40_custom`. In this step, you add the username (e.g., "admin") and the hashed password generated earlier. This restricts access to critical system settings and boot options to authorized users only.

3. **Updating GRUB**:
   After making changes to the GRUB configuration file, run the `update-grub` command to apply the new settings. This updates the GRUB configuration with the newly added superuser password.

### Important Considerations

- **Backup the GRUB Password**: It's essential to keep a secure backup of the GRUB password. If the password is forgotten or lost, it can render the system unmaintainable without reinstalling the bootloader or the operating system.
- **Security Benefits**: Setting a GRUB password enhances system security by preventing unauthorized users from modifying the boot parameters or accessing sensitive recovery modes, which could be exploited by attackers.
- **System Recovery**: If the GRUB password is lost, recovery options like resetting the password can be difficult. Therefore, it's crucial to store the password securely and ensure it’s recoverable when needed.

In summary, securing GRUB with a password is an effective way to prevent unauthorized modifications to system settings, and proper handling of the password is key to maintaining system security.


#### Set GRUB password to prevent unauthorized system modifications:

```bash
# Generate GRUB password hash
grub-mkpasswd-pbkdf2

# Add to /etc/grub.d/40_custom
set superusers="admin"
password_pbkdf2 admin <generated-hash>

# Update GRUB
update-grub
```

:::tip
Always maintain a secure backup of the GRUB password. Loss of the GRUB password can prevent system maintenance.
:::

## System Access Security

### SSH Hardening

1. Configure `/etc/ssh/sshd_config`:
```bash
# Disable root login
PermitRootLogin no

# Use SSH key authentication only
PasswordAuthentication no
PubkeyAuthentication yes

# Restrict SSH access to specific users/groups
AllowGroups ssh-users

# Change default port (optional)
Port 2222

# Disable forwarding
AllowAgentForwarding no
AllowTcpForwarding no
X11Forwarding no

# Set strict mode
StrictModes yes

# Limit authentication attempts
MaxAuthTries 3
MaxSessions 2

# Set login grace time
LoginGraceTime 30
```

2. Configure SSH key-based authentication:
```bash
# Generate SSH key (on client)
ssh-keygen -t ed25519 -a 100

# Copy public key to server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server
```

### Why SSH Hardening is Important

- **Prevent Unauthorized Access**: By disabling root login and enforcing key-based authentication, you make it much more difficult for attackers to gain access through weak passwords or brute force.
  
- **Limit Attack Surface**: Disabling unnecessary features like forwarding and restricting access to specific users reduces potential vectors for attack.

- **Improve Account Security**: Limiting login attempts and enforcing strict file permissions prevents exploitation of misconfigurations and reduces the impact of successful attacks.

In conclusion, SSH hardening on Debian Linux is essential for securing your system from unauthorized access. Properly configuring SSH settings and enforcing key-based authentication can significantly enhance your server’s security.

### PAM Configuration

PAM (Pluggable Authentication Modules) is a framework used by Linux systems to manage authentication and account policies. By configuring PAM, you can enhance the security of the system by setting limits on resource usage and enforcing strong password policies.

1. **Configuring `/etc/security/limits.conf`**:
   The `/etc/security/limits.conf` file allows you to set user-specific resource limits for processes, file sizes, and other system resources. These limits help prevent a single user or process from consuming excessive resources and potentially crashing the system.

   - **Limiting the Number of Processes**:  
     `* soft nproc 1024`  
     `* hard nproc 2048`  
     These settings limit the number of processes a user can spawn. The `soft` limit can be increased up to the `hard` limit, which acts as an absolute maximum. Limiting the number of processes helps prevent denial-of-service (DoS) attacks, where a user or process could attempt to consume all system resources.

   - **Limiting the File Size**:  
     `* soft fsize 50000000`  
     `* hard fsize 100000000`  
     These settings limit the maximum file size a user can create. By setting limits on file sizes, you can prevent users from accidentally or maliciously consuming too much disk space, which could potentially crash the system or make it unresponsive.

   These resource limits are particularly important for multi-user environments, ensuring that no single user can destabilize the system by using excessive resources.

2. **Enabling Password Quality Requirements in `/etc/pam.d/common-password`**:
   The `/etc/pam.d/common-password` file controls the password policies used on the system. Enforcing strong passwords is critical to defending against unauthorized access.

   - **Enforcing Strong Passwords**:  
     `password requisite pam_pwquality.so retry=3 minlen=12 difok=3 ucredit=-1 lcredit=-1 dcredit=-1 ocredit=-1`  
     This configuration uses the `pam_pwquality` module to enforce strict password policies. The settings include:
     
     - `minlen=12`: Ensures that passwords are at least 12 characters long, which makes them harder to guess or crack.
     - `difok=3`: Requires that a new password differs from the previous one by at least three characters.
     - `ucredit=-1`: Requires at least one uppercase letter in the password.
     - `lcredit=-1`: Requires at least one lowercase letter in the password.
     - `dcredit=-1`: Requires at least one digit in the password.
     - `ocredit=-1`: Requires at least one special character (e.g., `!`, `@`, `$`, etc.) in the password.
     - `retry=3`: Allows the user three attempts to set a password that meets these requirements.

   These password policies ensure that users create passwords that are complex and difficult to guess. By enforcing these rules, you reduce the risk of unauthorized access from weak or easily guessable passwords.

### Why PAM Configuration is Important

- **System Resource Protection**: Setting limits on system resources such as the number of processes and file sizes helps prevent abuse or accidental resource exhaustion, which could lead to a system crash or performance degradation.

- **Strong Passwords**: Enforcing strong password requirements ensures that users’ credentials are secure and not vulnerable to brute-force or dictionary attacks. Password complexity, length, and variety of characters make passwords much more difficult to crack.

- **System Stability and Security**: Proper PAM configuration helps ensure that users adhere to policies that safeguard the system against misuse, whether from resource exhaustion or weak authentication.

In conclusion, PAM configuration is a key part of system hardening. By setting appropriate resource limits and enforcing strong password policies, you can significantly improve the security and stability of your Debian-based system.


## File System Security

### Filesystem Permissions

Filesystem permissions are essential for ensuring that sensitive system files and directories are not accessed or modified by unauthorized users. By configuring proper file permissions and access control mechanisms, you can protect critical system files and prevent unauthorized access.

1. **Setting Secure Default Permissions**:
   The `umask` command is used to set default permissions for newly created files. By setting a secure umask, you can ensure that files are created with restrictive permissions, reducing the risk of accidental exposure or unauthorized access.

   - **Set Secure umask**:  
     `echo "umask 027" >> /etc/profile`  
     The `umask 027` ensures that new files are created with more restrictive permissions. Specifically, it ensures that:
     - Files are created with read and write permissions for the owner, and read permissions for the group.
     - Files are not accessible by others.

   - **Set Secure Permissions for System Files**:  
     Files such as `/etc/passwd`, `/etc/shadow`, `/etc/group`, and `/etc/gshadow` contain sensitive user and group information. Proper permissions should be set to prevent unauthorized users from reading or modifying them:
     
     - `chmod 644 /etc/passwd`: Sets read/write permissions for the owner and read-only permissions for the group and others. This file contains basic user information.
     - `chmod 640 /etc/shadow`: Sets read/write permissions for the owner and read-only permissions for the group, preventing others from accessing the file. This file contains encrypted passwords.
     - `chmod 644 /etc/group`: Sets read/write permissions for the owner and read-only permissions for the group and others. This file contains group information.
     - `chmod 640 /etc/gshadow`: Sets read/write permissions for the owner and read-only permissions for the group, preventing others from accessing it. This file contains group password information.

   Properly setting file permissions ensures that sensitive files are protected from unauthorized access while allowing necessary users or groups to interact with them.

2. **Implementing Filesystem ACLs**:
   Access Control Lists (ACLs) provide a more granular way to manage permissions for users and groups on a filesystem. While traditional UNIX permissions allow setting permissions for the owner, group, and others, ACLs allow for more flexible management by setting specific permissions for multiple users and groups.

   - **Install ACL Utilities**:  
     `apt install acl`  
     To use ACLs, the necessary utilities must be installed. This command installs the ACL package on a Debian-based system.

   - **Set ACL for a Directory**:  
     `setfacl -m g:developers:rx /var/www/html`  
     This command grants the `developers` group read and execute permissions (`rx`) on the `/var/www/html` directory. ACLs allow more granular control than traditional file permissions, enabling you to set permissions for specific users or groups without modifying the owner or other permissions.

### Why Filesystem Security is Important

- **Prevent Unauthorized Access**: Proper permissions ensure that only authorized users can access or modify sensitive files. For example, protecting files like `/etc/shadow` prevents unauthorized access to hashed passwords, which could lead to account compromise.

- **Minimize Risk of Data Exposure**: By setting secure default file permissions and ACLs, you reduce the risk of data being inadvertently exposed to unauthorized users. For instance, web server directories can be securely configured to allow only specific users (like the `developers` group) access.

- **Granular Control Over Permissions**: ACLs provide a more flexible way to manage access, allowing you to grant specific users or groups permissions to resources without changing global file permissions. This can be especially useful in complex environments where specific users need access to certain files or directories.

- **System Stability and Security**: By securing the filesystem with proper permissions and ACLs, you minimize the risk of accidental or malicious modifications to critical system files. Properly configured permissions help maintain system integrity and stability.


### Secure Mount Options

1. Enable disk encryption using LUKS:
```bash
# Create encrypted partition
cryptsetup luksFormat /dev/sda1

# Open encrypted partition
cryptsetup luksOpen /dev/sda1 secure-data

# Add to /etc/crypttab
secure-data UUID=<device-uuid> none luks
```

## Network Security

### Firewall Configuration

1. Configure NFTables:
```bash
# Create base firewall configuration
cat > /etc/nftables.conf << EOF
#!/usr/sbin/nft -f

flush ruleset

table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;
        
        # Accept established connections
        ct state established,related accept
        
        # Accept loopback
        iif lo accept
        
        # Accept SSH
        tcp dport 2222 accept
        
        # Accept HTTP/HTTPS
        tcp dport { 80, 443 } accept
    }

    chain forward {
        type filter hook forward priority 0; policy drop;
    }

    chain output {
        type filter hook output priority 0; policy accept;
    }
}
EOF

# Enable and start NFTables
systemctl enable nftables
systemctl start nftables
```


## Network Hardening Through Kernel Parameters

### Understanding sysctl and Network Security

The Linux kernel provides numerous parameters that can be tuned to enhance network security. These parameters are managed through the `sysctl` interface, which allows system administrators to modify kernel settings at runtime. The configuration file `/etc/sysctl.conf` provides persistent storage for these settings.

### Key Network Security Parameters

#### IPv6 Management

Modern Linux systems come with IPv6 enabled by default. While IPv6 is important for future-proofing your network, it can introduce additional attack surfaces if not actively used. Disabling IPv6 when not needed reduces the potential attack surface.

:::tip IPv6 Considerations
Before disabling IPv6, ensure that:
- No applications in your stack require IPv6
- Your monitoring can handle IPv6 being disabled
- You have a plan for future IPv6 implementation if needed
:::

#### IP Spoofing Protection

IP spoofing is a common attack vector where malicious packets are crafted with forged source addresses. The Reverse Path Filter (`rp_filter`) is a kernel feature that helps prevent IP spoofing attacks by validating source addresses of incoming packets.

Two levels of filtering are available:
- Strict mode (1): Packets must come from an interface that would be used to route replies
- Loose mode (2): Packets must come from any interface listed in the routing table

#### ICMP Redirect Security

ICMP redirects are messages that can modify system routing tables. While legitimate in some network configurations, they're often used in man-in-the-middle attacks. Disabling ICMP redirect acceptance prevents attackers from manipulating your system's routing.

:::warning ICMP Considerations
Some network configurations legitimately use ICMP redirects. Before disabling:
- Verify your network architecture
- Test in a staging environment
- Document any potential impact on routing
:::

#### SYN Cookie Protection

SYN cookie protection is a crucial defense against SYN flood attacks, a type of denial-of-service attack. When enabled:
- System generates special TCP SYN cookies when the SYN queue overflows
- Legitimate connections can still be established during a SYN flood
- Minimal performance impact during normal operation

#### Source Routing Security

Source routing allows packets to specify their own routing path. While this feature has legitimate uses in network troubleshooting, it's commonly exploited in network attacks to:
- Bypass firewall rules
- Manipulate routing paths
- Conduct man-in-the-middle attacks

### Implementation Best Practices

1. **Staged Deployment**:
   - Test changes in development environment first
   - Monitor system behavior after changes
   - Have a rollback plan ready

2. **Documentation**:
   - Document all parameter changes
   - Include justification for each setting
   - Maintain change history

3. **Monitoring**:
   - Set up alerts for network anomalies
   - Monitor system logs for security events
   - Regular audits of network parameters

4. **Regular Review**:
   - Periodically review network settings
   - Stay informed about new security threats
   - Update parameters based on current best practices

### Performance Considerations

Network hardening can sometimes impact system performance. Consider:
- Monitoring network performance before and after changes
- Balancing security needs with performance requirements
- Testing under various load conditions

### Additional Security Measures

Network parameter hardening should be part of a comprehensive security strategy including:
1. Firewall configuration
2. Intrusion Detection Systems (IDS)
3. Regular security audits
4. Network monitoring
5. Incident response planning

:::tip Verification
After applying changes:
- Verify settings with `sysctl -a`
- Test network connectivity
- Monitor system logs for issues
- Conduct security testing
:::

```bash
# Disable IPv6 if not needed
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1

# Protect against IP spoofing
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Disable ICMP redirect acceptance
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0

# Enable TCP SYN cookie protection
net.ipv4.tcp_syncookies = 1

# Disable source packet routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0

# Apply changes
sysctl -p
```

### Maintenance and Upkeep

1. **Regular Auditing**:
   - Schedule periodic reviews of network parameters
   - Verify settings after system updates
   - Document any deviations from baseline

2. **Incident Response**:
   - Include network parameters in incident response plans
   - Maintain procedures for emergency parameter adjustments
   - Document recovery procedures

3. **Training**:
   - Train system administrators on parameter significance
   - Document troubleshooting procedures
   - Include network hardening in security training

## Service Hardening

### SystemD Service Hardening

1. Create secure service templates:
```bash
# Example secure service configuration
[Service]
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
NoNewPrivileges=yes
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE
SystemCallFilter=@system-service
SystemCallErrorNumber=EPERM
```

### AppArmor Configuration

1. Install and configure AppArmor:
```bash
# Install AppArmor
apt install apparmor apparmor-utils

# Enable AppArmor
systemctl enable apparmor
systemctl start apparmor

# Create custom profile
aa-genprof /usr/bin/my-application
```

## Monitoring and Auditing

### Audit System Configuration

1. Configure auditd:
```bash
# Install audit system
apt install auditd

# Configure audit rules in /etc/audit/rules.d/audit.rules
-w /etc/passwd -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k sudo_config
-w /etc/ssh/sshd_config -p wa -k sshd_config

# Restart audit daemon
systemctl restart auditd
```

### System Logging

1. Configure remote logging:
```bash
# Install rsyslog
apt install rsyslog

# Configure remote logging in /etc/rsyslog.conf
*.* @logserver.example.com:514
```

### HIDS Configuration

1. Install and configure OSSEC:
```bash
# Install OSSEC
apt install ossec-hids

# Configure OSSEC
/var/ossec/bin/ossec-control start
```

## Container Security

### Docker Hardening

1. Configure secure Docker daemon:
```bash
# Create daemon.json
cat > /etc/docker/daemon.json << EOF
{
  "userns-remap": "default",
  "live-restore": true,
  "userland-proxy": false,
  "no-new-privileges": true,
  "selinux-enabled": true,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
```

2. Secure Docker container defaults:
```bash
# Example secure Docker run command
docker run \
  --cap-drop=ALL \
  --security-opt=no-new-privileges:true \
  --read-only \
  --tmpfs /tmp \
  --network=none \
  your-image
```

:::tip Container Best Practices
- Always use official base images
- Implement multi-stage builds
- Run containers as non-root users
- Regularly scan containers for vulnerabilities
- Use container-specific security tools (Trivy, Clair, etc.)
:::

### Regular Maintenance

1. Implement automated security updates:
```bash
# Install unattended-upgrades
apt install unattended-upgrades

# Configure automatic security updates
dpkg-reconfigure unattended-upgrades
```

2. Regular security checks:
```bash
# Create security check script
cat > /usr/local/bin/security-check.sh << EOF
#!/bin/bash

# Check for failed login attempts
journalctl -u ssh | grep "Failed password"

# Check for modified system files
aide --check

# Check running services
systemctl list-units --type=service

# Check open ports
ss -tuln

# Check system logs for suspicious activity
grep -i "authentication failure" /var/log/auth.log
EOF

chmod +x /usr/local/bin/security-check.sh
```

:::tip Important Security Notes
1. Regular backups are crucial for system recovery
2. Keep all software and packages updated
3. Monitor system logs regularly
4. Conduct periodic security audits
5. Document all security changes and configurations
:::