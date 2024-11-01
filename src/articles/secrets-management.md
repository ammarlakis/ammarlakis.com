---
title: "Managing Secrets in Git with GitSOPS: A Secure and Simple Approach"
date: 2024-10-04
tags: ["secrets", "platform-engineering", "gitops"]
---

Secrets management can feel complex, but at its core, secrets are simply configurations that require added security. By shifting our perspective to view secrets as configuration data with specific security needs, we can adopt simpler, effective management solutions. With tools like [SOPS](https://github.com/getsops/sops) and GitHub Actions, we can securely store, version, and manage secrets directly in Git repositories, keeping Git as the single source of truth and aligning with GitOps principles.

## Why Manage Secrets in Git?

Traditionally, storing secrets in Git has been discouraged due to exposure risks—secrets in plain text could be inadvertently shared, cloned, or made public. Many teams use dedicated secret management tools, such as Vault or cloud services like AWS Secrets Manager, or manage secrets as environment variables on deployment platforms. While effective, these solutions often introduce external dependencies, additional complexity, and may lack flexibility in meeting custom policy or team needs.

With SOPS and automated workflows, securely managing secrets within Git is now practical and efficient. By storing encrypted secrets alongside deployment code, we leverage version control, auditability, and easy updates while avoiding the overhead of additional infrastructure components.

## Requirements for Effective Secrets Management

To securely manage secrets in Git, several key practices are essential:

1. **Versioning and Auditing**  
   Secrets, like other configurations, evolve over time. Version control allows teams to track changes, revert them when necessary, and audit updates, providing full traceability and context.

2. **Access Policies**  
   Access control policies define who can access, update, or rotate secrets, providing an essential layer of security.

3. **Rotation**  
   Regular rotation of secrets (e.g., API keys or passwords) minimizes exposure risk. Automating rotation workflows ensures secrets are consistently updated without manual intervention.

4. **Ease of Update**  
   In agile environments, updating secrets needs to be efficient and fast, especially during security incidents. The secrets management system should enable quick, seamless updates and propagation without downtime.

5. **Integration with Existing Platforms**  
   Embedding secrets management into existing tools enhances the developer experience, enabling teams to manage secrets within their familiar workflow without needing to adopt or learn new tools.

## A Modern Solution: SOPS, Git, and GitHub Workflows

By combining **SOPS** with **GitHub Actions**, we achieve a secure, auditable, and developer-friendly approach to secrets management. Here’s how it works:

### Storing Encrypted Secrets in Git

Using SOPS, secrets are stored as encrypted fields within dotenv, YAML, JSON, or other files in Git. These secrets are encrypted before committing, ensuring they remain secure even if the repository is cloned or accessed by unauthorized parties. 

Encryption keys should be managed separately through a secure Key Management System (KMS) like AWS KMS or GCP KMS. This approach ensures that even with repository access, decryption still requires a secure external key, preserving confidentiality.

### Automating Secrets Management with GitHub Actions

GitHub Actions automate the entire secrets management lifecycle—from creation and updates to deletion and deployment. Here’s how this works:

1. **Branch-Based Updates**  
   When a secret change is needed, a new branch is created. This isolates the update process and enables peer review and policy enforcement before merging.

2. **Automated Workflows**  
   GitHub Actions automate key tasks:
   - **Upsert Workflow**: Encrypts a new or updated secret with SOPS and commits it back to the repository.
   - **Delete Workflow**: Removes specified secrets and commits the change.
   - **Read and Deploy Workflow**: Decrypts secrets and exports them as environment variables, making them accessible securely in subsequent steps.

3. **Controlled Encryption and Decryption**  
   Encryption and decryption occur within GitHub’s environment, reducing exposure risk and maintaining the least-privilege principle by keeping unencrypted secrets off local machines.

## Benefits of Managing Secrets with Git and GitHub Workflows

- **Version Control and History**  
  Git’s version control allows teams to track changes to secrets, offering a historical record of changes and who made them.

- **Enhanced Auditability**  
  With GitHub’s access controls and branch protection rules, it’s easy to audit changes and limit who can update secrets.

- **Streamlined Developer Experience**  
  Developers use familiar tools like Git and GitHub, avoiding additional secret management platforms. Managing secrets as files also simplifies automation and custom workflows.

- **Vendor Neutrality**  
  This approach avoids vendor lock-in by using open-source tools and standard workflows, allowing teams to manage secrets independently of proprietary systems.

- **Extensible Security Policies**  
  Workflows can be extended with tools like [Open Policy Agent (OPA)](https://www.openpolicyagent.org/) to enforce security policies before secrets are merged. For example, developers can manage service-specific secrets in development environments without requiring additional approvals.

## Implementing Secrets Management with GitSOPS

The [GitSOPS](https://github.com/ammarlakis/gitsops) project provide actions for secrets management in dotenv files using SOPS for encryption. [GitSOPS Demo](https://github.com/ammarlakis/gitsops-demo) provides example workflows for reading, upserting, and deleting secrets, demonstrating a practical implementation.

Here's an example of how the upsert is implemented in GitSOPS Demo:

```yaml
name: Upsert Secret

on:
  workflow_dispatch:
    inputs:
      secret_name:
        description: The name of the secret to add or update
        required: true
      secret_value:
        description: The value of the secret
        required: true
      environment:
        description: THe environment to update its secrets
        type: choice
        options:
          - development
          - production

concurrency: 
  group: ${{ github.ref }}
  cancel-in-progress: false

permissions:
  contents: write

jobs:
  upsert-secret:
    runs-on: ubuntu-latest

    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      AWS_DEFAULT_REGION: "us-east-1"

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Upsert secret in dotenv file
        uses: ammarlakis/gitsops/action/upsert@master
        with:
          secret_name: ${{ github.event.inputs.secret_name }}
          secret_value: ${{ github.event.inputs.secret_value }}
          secret_file_path: myproject/${{ github.event.inputs.environment }}-secrets.env

      - name: Commit and push changes
        run: echo "Committing and pushing. See the repo for full details"
```

The secrets name and value are being provided by user input, which means you need to clear access logs, but that's the only thing you need to care about. Secret values are being masked when the reading secrets action loads them as environment variables.

In this implementation, GitSOPS utilizes Git as the storage backend for configuration management, GitHub Actions as the API, and GitHub’s web interface for interaction. In a mature implementation, an internal developer portal could serve as the primary interface, with the GitHub web interface reserved for debugging.

### GitSOPS per Project

Implementing GitSOPS in individual project workflows allows customization for each project’s unique requirements, such as environment-specific secrets management. However, a lot of steps need to be repeated on all the projects, but that shouldn't be an issue if the correct ownership model is implemented in the company where each team can update their own projects and maintain them.

### Central GitSOPS

A central repository holds the workflows, which operate on different project repositories by checking them out and modifying their secrets. This reduces code duplication, but complicates permissions management and increases potential impact if workflow changes are made.

## Conclusion

Combining SOPS encryption with Git and GitHub workflows enables teams to manage secrets securely and efficiently. This approach leverages Git’s version control, auditability, and ease of use, all while ensuring confidentiality of sensitive information. GitSOPS supports modern, agile development practices within a GitOps framework, offering a practical and scalable solution for secure secrets management.
