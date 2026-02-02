---
type: doc-template
target: .context/docs/{name}.md
---

# AI Guide

You are helping the user create a documentation file. Follow these steps:
1. Ask the user about the topic they want to document
2. Determine the type of documentation (README, API docs, guide, etc.)
3. Gather the necessary information
4. Fill in the appropriate template

# Questions to Ask

1. What is the purpose of this documentation?
2. Who is the target audience (developers, users, ops)?
3. What are the main sections you want to include?
4. Are there any code examples or commands to include?
5. Are there any prerequisites or dependencies to mention?

# Template Output - README Style

```markdown
# {Project/Feature Name}

> {Brief description}

## Overview

{Detailed description of what this is and why it exists}

## Prerequisites

- {Prerequisite 1}
- {Prerequisite 2}

## Installation

{Installation steps}

## Usage

{Basic usage examples}

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `option1` | string | - | Description |

## Examples

{Code examples with explanations}

## Troubleshooting

### Common Issue 1
{Solution}

## Related Documentation

- [Link 1](url)
- [Link 2](url)
```
