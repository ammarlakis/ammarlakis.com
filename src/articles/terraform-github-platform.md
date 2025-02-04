---
title: Terraform in the Era of Platform Engineering
date: 2024-11-03
tags: ["developer-experience", "terraform", "platform-engineering", "github", "actions"]
---

The adoption of infrastructure as code (IaC) has bridged gaps between infrastructure teams and developers, allowing for a shared understanding of resources. However, there's a catch: IaC tools come with a learning curve, and infrastructure work isn't typically in a developer's skill set. This often means that developers either invest time in learning these tools—relying on the infrastructure team for troubleshooting—or leave the work entirely to ops, which creates bottlenecks and delays, even for small changes.

To overcome these challenges, we need true self-service: a model that provides developers with accessible, intuitive tools that embed operational knowledge.

## Infrastructure as Code: The Current State

In mature infrastructure setups, the process often looks like this:
- Infrastructure is configured as code in Git.
- CI/CD pipelines automatically check and deploy approved changes.
- The infrastructure team (or a specialized subteam) reviews and approves these changes.

Terraform is a robust choice for IaC, providing consistency and reliability in resource management, from development to production. When paired with CI/CD pipelines, automation seamlessly integrates into the workflow, minimizing manual tasks and allowing developers to focus on development. However, while these tools streamline workflows, they still present complexity. This is where an intuitive self-service model becomes essential.

## Making Infrastructure Accessible with a YAML-to-Terraform Interface

To make infrastructure code more accessible, we can introduce a YAML-based interface that translates into Terraform resources, dropping the need for direct Terraform experience. Terraform's support for functions like [`fileset`](https://developer.hashicorp.com/terraform/language/functions/fileset) and [`yamldecode`](https://developer.hashicorp.com/terraform/language/functions/yamldecode) makes this straightforward.

Take an organization that wants to manage GitHub repositories via Terraform for example. We can allow developers to define repository details and permissions in YAML files, which Terraform reads and processes.

```yaml
name: awesomeify
description: "This is my awesome project"
visibility: public
permissions:
  users:
    admin: [ "ammarlakis" ]
  teams:
    maintain: [ "teamrocket" ]
```

These YAML files are validated against a JSON schema before reaching Terraform in CI/CD, ensuring that developers understand the structure and requirements for these configurations:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "GitHub repository",
  "type": "object",
  "properties": {
    "name": { "type": "string", "description": "Repository name" },
    "description": { "type": "string", "description": "Repository description" },
    "visibility": { "type": "string", "enum": ["private", "public", "internal"], "description": "Repository visibility level" },
    "permissions": {
      "type": "object",
      "properties": {
        "users": { /* Permissions for individual users */ },
        "teams": { /* Permissions for teams */ }
      }
    }
  }
}
```

Now, developers can create or modify a YAML file to generate the resources they need. Although this example involves GitHub repositories, the same approach can scale for managing AWS accounts or even more complex modules that can deploy whole applications and their infrastructure components.

## User-Friendly Automation with GitHub Actions

To streamline provisioning, we can leverage CI/CD systems to automate the process. For instance, GitHub Actions enables creating a manually run workflow that takes user inputs to generate YAML files, pushes them to a repository, and triggers Terraform pipelines to provision resources. Here's an example of a GitHub Actions workflow for adding a repository:

```yaml
name: Add GitHub Repository
on:
  workflow_dispatch:
    inputs:
      name: 
        description: The repository name
        type: string
        required: true
      description: ...
      visibility: ...
      topics: ...
      permissions: ...

jobs:
  AddRepository:
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Generate Repository YAML
        run: |
          # Building YAML content from input
         ## Scripting that constructs the yaml from the input ..
          echo -e "$yaml_content" > data/repositories/${{ inputs.name }}.yaml

      - name: Commit and Push Changes
        run: |
          git add data/repositories/${{ inputs.name }}.yaml
          git commit -m "Add repository ${{ inputs.name }}"
          git push origin
```

With this workflow, developers simply trigger an action, fill in the details, and the system handles the rest. This structure is flexible enough to accommodate most use cases without overwhelming developers with complex tooling.

You can find a real-world example of this approach in the [github-iac](https://github.com/ammarlakis/github-iac) project that I use to manage my git repositories. Another example is project [aws-org-iac](https://github.com/ammarlakis/aws-org-iac) that I'm working on for managing an AWS organization.

## Benefits and Limitations

The model is intuitive, integrates smoothly with Git, and avoids Terraform’s complexity for developers. However, it's worth noting that while fast enough for most use cases, this approach isn't the fastest solution out there, and it can become complex if overloaded with features.
This solution is ideal for teams seeking a fast, bootstrap platform without the need to build custom tooling from scratch.

## Conclusion: Enabling Self-Service Infrastructure for Modern Development

This self-service model empowers teams to deploy faster, reduces dependencies on ops, and allows developers to engage directly with infrastructure in a controlled, manageable way. The end result is a more agile and collaborative DevOps environment where productivity flourishes. This model empowers teams to innovate quickly, proving that simplicity and automation can drive both productivity and collaboration in DevOps.
