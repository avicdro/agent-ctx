# Project State (Memory)

> This file is updated manually so the AI knows where it left off in the last session.
> **Last updated:** 2026-02-04

## Current Context

The project is in **active development (v1.0.1)** with a stable core feature set. Focus is on internationalization, improved CI/CD, and documentation.

## Recently Completed

- [x] TypeScript migration from JavaScript
- [x] Unified Context Schema (UCS) architecture implementation
- [x] Modern bridge file formats for Cursor, Copilot, Claude Code, Antigravity
- [x] Memory Bank pattern (`.context/memory/` files)
- [x] CLI commands: init, add, centralize, clean, doctor, update
- [x] Internationalization support (English and Spanish)
- [x] ASCII art branding with Figlet
- [x] npm publishing with provenance via GitHub Actions
- [x] Basic test coverage for bridges, templates, and utilities

## In Progress (Current Sprint)

- [ ] Translate README.md to English
- [ ] Translate .context/ files to English
- [ ] Fix GitHub Actions CI/CD errors
- [ ] Improve error handling and user messages

## Coming Up Next

- [ ] Define skill distribution strategy (npm packages vs git submodules vs registry)
- [ ] Refactor `add` command for better robustness
- [ ] Add CONTRIBUTING.md guide
- [ ] Document how to create custom templates
- [ ] Improve `.agent-ctx.json` configuration validation

## Known Bugs / Technical Debt

| Bug/Issue | Priority | Notes |
|-----------|----------|-------|
| `add` command needs refinement | Medium | Currently basic implementation |
| CI/CD workflow errors | High | `.github/workflows/release.yml` needs debugging |
| MCP integration unclear | Low | `.context/mcp/` purpose needs definition |
| Some code comments in Spanish | Low | Should be English for consistency |

## Important Decisions

- **Bridge-only approach**: Editor-specific files now point to AGENTS.md instead of duplicating content
- **Template localization**: Separate `en/` and `es/` template directories instead of inline translations
- **ESM only**: No CommonJS support; requires Node.js 18+
- **No `any`**: Strict TypeScript with no permissive types

## Notes for Next Session

> Write here anything important the AI should know before starting to work:

- The project uses itself for its own context (dogfooding `.context/`)
- ROADMAP.md contains the full list of planned improvements
- Some internal comments are still in Spanish (migration in progress)

## Current Restrictions

- Do not modify `.context/mcp/` until MCP strategy is defined
- Avoid breaking changes to the CLI interface (commands and options)
- Keep backwards compatibility with existing `.agent-ctx.json` configs
