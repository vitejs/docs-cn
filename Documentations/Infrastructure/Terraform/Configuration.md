---
title: Configuration
description: Configuration of Terraform projects and files.
mermaidTheme: forest
---

# Terraform Configuration

Terraform configurations are written in HashiCorp Configuration Language (HCL) and define the infrastructure resources you want to manage.

## Project Structure

A typical Terraform project contains:

- `main.tf`: Main configuration file
- `variables.tf`: Input variables
- `outputs.tf`: Output values
- `terraform.tfvars`: Variable values

```text
project/
├── main.tf
├── variables.tf
├── outputs.tf
└── terraform.tfvars
```

## Basic Configuration Example

Below is a minimal example that configures a local file resource:

```hcl
# main.tf
resource "local_file" "example" {
  content  = "Hello, Terraform!"
  filename = "${path.module}/hello.txt"
}
```

## Initializing the Project

Before applying any configuration, initialize the working directory:

```sh
terraform init
```

## Applying the Configuration

To create the defined resources:

```sh
terraform apply
```

You will be prompted to approve the plan before Terraform makes any changes.

## File Breakdown

- **main.tf**: Contains resource definitions.
- **variables.tf**: Declares variables used in the configuration.
- **outputs.tf**: Specifies outputs to display after apply.
- **terraform.tfvars**: Provides values for variables.

## Example: Using Variables

```hcl
# variables.tf
variable "file_content" {
  description = "Content for the file"
  type        = string
  default     = "Hello, Terraform with variables!"
}

# main.tf
resource "local_file" "example" {
  content  = var.file_content
  filename = "${path.module}/hello.txt"
}
```

## Useful Links

- [Terraform Configuration Language Docs](https://developer.hashicorp.com/terraform/language)
- [Resource Types](https://registry.terraform.io/browse/providers)


::: tip
Keep your configuration files organized for better maintainability.
:::
