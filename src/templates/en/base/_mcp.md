---
type: mcp-template
target: .context/mcp/{name}.md
---

# AI Guide

You are helping the user document an MCP (Model Context Protocol) server configuration. Follow these steps:
1. Ask about the MCP server they're using or creating
2. Gather the tools/resources it provides
3. Document usage patterns and examples

# Questions to Ask

1. What is the name of the MCP server?
2. What capabilities does it provide (tools, resources, prompts)?
3. How is it configured/initialized?
4. What are the main commands or tools available?
5. Are there any environment variables or secrets needed?

# Template Output

```markdown
# 🔌 MCP Server: {name}

> {Brief description of what this server does}

## Overview

{What this MCP server provides and why it's useful}

## Installation

{How to install or enable this server}

## Configuration

```json
{
  "mcpServers": {
    "{name}": {
      "command": "{command}",
      "args": ["{args}"],
      "env": {
        "VAR_NAME": "value"
      }
    }
  }
}
```

## Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `tool_name` | What it does | `param1`, `param2` |

## Available Resources

| Resource | URI Pattern | Description |
|----------|-------------|-------------|
| `resource_name` | `protocol://path` | What it provides |

## Usage Examples

### Example 1: {Description}
{How to use a specific tool or resource}

### Example 2: {Description}
{Another usage example}

## Best Practices

- {Best practice 1}
- {Best practice 2}

## Troubleshooting

### {Common Issue}
{Solution}
```
