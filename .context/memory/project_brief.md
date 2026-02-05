---
name: project_brief
description: Project vision and goals - static, rarely changes
---

# Project Brief

## Vision

**agent-ctx** aims to be the universal standard for providing context to AI coding assistants. By creating a consistent `.context/` directory structure and generating bridge files for different AI editors, developers can maintain a single source of truth for project conventions, architecture, and coding standards that all AI tools can understand.

## Goals

- [x] Create a unified context structure that works across all AI code editors
- [x] Generate bridge files that translate context to editor-specific formats
- [x] Provide a CLI tool that's easy to install and use via npm
- [ ] Establish the `.context/` pattern as an industry standard
- [ ] Build a community-driven skills ecosystem

## Success Criteria

1. Developers can initialize context structure with a single command
2. All major AI code editors (Cursor, Copilot, Claude, Cline, Antigravity) are supported
3. Context can be shared and versioned alongside code
4. AI assistants follow project conventions more accurately

## Constraints

- **Technical**: Must work on Node.js 18+ (ESM-only)
- **Compatibility**: Must not conflict with existing editor configurations
- **Simplicity**: CLI must be intuitive for developers of all skill levels
- **Portability**: Generated files should be human-readable Markdown

## Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| Creator | avicdro | Project vision, architecture, implementation |
| Community | npm users | Feedback, feature requests, contributions |
