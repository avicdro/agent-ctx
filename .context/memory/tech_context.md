---
name: tech_context
description: Technical stack and dependencies - semi-static, updates with major changes
---

# Technical Context

## Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Language | TypeScript | ^5.9.3 |
| Runtime | Node.js | ≥18.0.0 |
| Module System | ESM | Native |
| CLI Framework | Commander.js | ^12.1.0 |
| Build | tsc | ^5.9.3 |

## Dependencies

### Production

| Package | Purpose |
|---------|---------|
| `commander` | CLI command framework and argument parsing |
| `inquirer` | Interactive terminal prompts for user input |
| `chalk` | Colored terminal output for better UX |
| `ora` | Elegant spinners for async operations |
| `figlet` | ASCII art text generation for branding |
| `tar` | Extract npm package tarballs for skills |

### Development

| Package | Purpose |
|---------|---------|
| `typescript` | TypeScript compiler |
| `tsx` | Run TypeScript files directly in development |
| `eslint` | Code linting and style enforcement |
| `@types/node` | Node.js type definitions |
| `@types/inquirer` | Inquirer type definitions |
| `@types/figlet` | Figlet type definitions |
| `@types/tar` | Tar type definitions |

## Architecture Decisions

### ESM-Only Approach

**Context:** The JavaScript ecosystem is moving towards ES Modules as the standard.
**Decision:** Drop CommonJS support entirely, require Node.js 18+.
**Consequences:** Simpler codebase, no dual-build complexity, but some older environments won't work.

### TypeScript Strict Mode

**Context:** Need to maintain code quality and catch bugs early.
**Decision:** Enable `strict: true` in tsconfig, forbid `any` type.
**Consequences:** Better type safety, more explicit code, occasional type gymnastics.

### Bridge File Pattern

**Context:** Different AI editors have different configuration formats.
**Decision:** Generate "bridge files" that point to a central AGENTS.md instead of duplicating content.
**Consequences:** Single source of truth, easier maintenance, less drift between configs.

### Internationalization

**Context:** Target Spanish and English-speaking developers initially.
**Decision:** Separate template directories (`en/`, `es/`) and runtime i18n via `t()` function.
**Consequences:** Clean separation, easy to add more languages later.

## Integration Points

- **npm Registry:** Package published with provenance for skill downloads
- **GitHub:** Repository hosting, CI/CD via Actions, issue tracking
- **File System:** Reads/writes to user's project directory
