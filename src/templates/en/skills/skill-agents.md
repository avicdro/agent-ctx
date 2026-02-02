---
name: managing-agents
description: Configure and update AGENTS.md context file for AI agents. Use when setting up agent context or modifying agent instructions.
---

# Managing Agents Context

Configure the AGENTS.md file that orients AI agents to your project.

## When to use

- Setting up AI agent context for a new project
- Updating agent instructions
- Adding new knowledge sources for agents
- Changing how agents should behave in your project

## AGENTS.md Purpose

The AGENTS.md file is the entry point for AI agents. It tells them:
- What the project does
- Where to find critical information
- How to behave and what rules to follow

## Standard Template

```markdown
# AI Agent Context

You are a senior developer joining this project.
Your goal is to help build, refactor, and maintain code following our architecture.

## Knowledge Index

Before writing code, load context from:

- **Architecture:** `.context/architecture.md`
- **Rules:** `.context/rules/coding-standards.md`
- **Skills:** `.context/skills/`

## Current State

Check `.context/project_state.md` for current work status.
```

## Best Practices

### ✅ Do

- Keep AGENTS.md concise (under 50 lines)
- Point to detailed files instead of duplicating content
- Update when project structure changes
- Include path to rules and conventions

### ❌ Avoid

- Putting detailed documentation in AGENTS.md
- Outdated file paths
- Generic instructions without project specifics
- Conflicting information between files

## Placement

AGENTS.md should be at the project root:

```
project/
├── AGENTS.md           # AI agent entry point
├── .context/           # Detailed context
│   ├── architecture.md
│   ├── project_state.md
│   ├── rules/
│   └── skills/
└── src/
```
