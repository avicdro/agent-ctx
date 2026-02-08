# Project Architecture

## Project Goal

**agent-ctx** is a CLI tool that initializes and manages AI agent context for software projects. It creates a standardized `.context/` directory structure and generates bridge files that allow different AI code editors (Cursor, Claude Code, GitHub Copilot, Antigravity, Cline) to understand and follow project-specific conventions.

## Tech Stack

### Runtime
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | ≥20.0.0 | Runtime environment |
| TypeScript | ^5.9.3 | Type-safe JavaScript |
| ES Modules | ESM | Module system |

### CLI Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| Commander.js | ^12.1.0 | Command-line interface framework |
| Inquirer | ^9.2.23 | Interactive prompts |
| Chalk | ^5.3.0 | Terminal string styling |
| Ora | ^8.0.1 | Elegant terminal spinners |
| Figlet | ^1.10.0 | ASCII art text for branding |

### Utilities
| Technology | Version | Purpose |
|------------|---------|---------|
| tar | ^7.5.7 | Tarball extraction for skills |

### Build & Development
| Technology | Version | Purpose |
|------------|---------|---------|
| tsx | ^4.21.0 | TypeScript execution |
| ESLint | ^9.39.2 | Code linting |

## Directory Structure

```
agentrc/
├── src/                      # Source code
│   ├── bin/                  # Entry point (agent-ctx.js)
│   ├── commands/             # CLI command implementations
│   │   ├── init.ts           # Initialize .context structure
│   │   ├── add.ts            # Add skills from npm
│   │   ├── centralize.ts     # Move scattered skills to .context/
│   │   ├── clean.ts          # Remove redundant editor folders
│   │   ├── doctor.ts         # Check integrity and offer repairs
│   │   └── update.ts         # Regenerate bridge files
│   ├── lib/                  # Shared utilities
│   │   ├── bridges.ts        # Bridge file generators for editors
│   │   ├── config.ts         # .agent-ctx.json configuration loader
│   │   ├── i18n.ts           # Internationalization (en/es)
│   │   ├── logger.ts         # Logging utilities with spinners
│   │   ├── templates.ts      # Template path resolution
│   │   └── utils.ts          # File system utilities
│   ├── templates/            # Template files
│   │   ├── en/               # English templates
│   │   └── es/               # Spanish templates
│   └── index.ts              # CLI program registration
├── __tests__/                # Test files
│   ├── bridges.test.js       # Bridge generation tests
│   ├── templates.test.js     # Template resolution tests
│   ├── utils.test.js         # Utility function tests
│   └── e2e/                  # End-to-end tests
├── dist/                     # Compiled output
├── .context/                 # Project's own context (dogfooding)
├── .github/                  # GitHub Actions workflows
├── AGENTS.md                 # AI agent entry point
├── ROADMAP.md                # Project roadmap and future plans
└── package.json              # Package configuration
```

## Data Flow

```
[User] → [CLI Command] → [Command Handler] → [Utilities/Templates] → [File System]
```

1. User runs `agent-ctx <command>` in terminal
2. Commander.js routes to the appropriate command handler
3. Inquirer prompts for interactive options if needed
4. Command reads templates and/or existing files
5. Utilities (bridges.ts, utils.ts) generate/modify content
6. Files are written to the target directory
7. Logger provides feedback with spinners and colored output

## CLI Commands

| Command | Description |
|---------|-------------|
| `init [directory]` | Initialize .context structure and bridge files |
| `add <skill-name>` | Download and install a skill from npm |
| `centralize [directory]` | Find and move scattered skills to .context/skills/ |
| `clean [directory]` | Remove redundant editor folders that duplicate skills/rules |
| `doctor [directory]` | Check integrity of .context and bridge files, offer repairs |
| `update [directory]` | Regenerate bridge files with latest templates |

## Supported AI Editors

The tool generates "bridge files" that help AI editors understand the project context:

| Editor | Bridge File Location |
|--------|---------------------|
| Cursor (Modern) | `.cursor/rules/global.md` |
| Claude Code | `CLAUDE.md` |
| GitHub Copilot (Global) | `.github/copilot-instructions.md` |
| GitHub Copilot (Scoped) | `.github/instructions/context.instructions.md` |
| Antigravity | `.agent/rules/context.md` |

## Critical Dependencies

| Package | Why it's important |
|---------|-------------------|
| `commander` | Core CLI framework - all commands depend on it |
| `inquirer` | Interactive prompts for init command selection |
| `chalk` | User-friendly colored terminal output |
| `tar` | Skill extraction from npm packages |

## Environment Variables

This project does not require any environment variables for normal operation.

## Project Conventions

- **Branches**: `main`, `feature/*`, `fix/*`
- **Commits**: Conventional Commits
- **Code**: See `.context/rules/coding-standards.md`
- **Publishing**: npm with provenance via GitHub Actions
