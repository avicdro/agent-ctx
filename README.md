# agent-ctx

> CLI to initialize and manage AI agent context in your projects

[![npm version](https://badge.fury.io/js/agent-ctx.svg)](https://www.npmjs.com/package/agent-ctx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[Español](./docs/README.es.md)** | English

## What is agent-ctx?

**agent-ctx** is a CLI tool that sets up a standardized context structure (`.context/`) so any AI agent (Cursor, Windsurf, Claude, Copilot, Cline, etc.) can understand your project consistently.

### Why use it?

- **Cross-platform** — Works on Windows, Mac, and Linux without bash dependencies
- **Easy to distribute** — Just run `npx agent-ctx init` and you're done
- **Single source of truth** — Centralized context for all your agents
- **Self-healing** — Detects and repairs broken configuration files
- **Modular skills** — Reusable skill structure for sharing knowledge across projects

## Installation

```bash
# Direct usage with npx (recommended)
npx agent-ctx init

# Or install globally
npm install -g agent-ctx
```

## Commands

### `agent-ctx init`

Initializes the `.context/` structure and generates bridge files for different editors.

```bash
npx agent-ctx init                    # Current directory
npx agent-ctx init ./my-project       # Specific directory
npx agent-ctx init --yes              # Non-interactive mode
npx agent-ctx init --force            # Overwrite existing files
npx agent-ctx init --dry-run          # Preview changes only
```

### `agent-ctx update`

Regenerates bridge files with the latest templates without touching `.context/`.

```bash
npx agent-ctx update                  # Interactive
npx agent-ctx update --yes            # Update all
```

### `agent-ctx centralize`

Finds scattered skills in editor folders (`.cursor/skills`, `.windsurf/skills`, etc.) and moves them to `.context/skills/`.

```bash
npx agent-ctx centralize
npx agent-ctx centralize --dry-run
```

### `agent-ctx clean`

Removes redundant editor folders that duplicate skills/rules.

```bash
npx agent-ctx clean
npx agent-ctx clean --yes             # Skip confirmation
npx agent-ctx clean --dry-run
```

### `agent-ctx doctor`

Checks the integrity of `.context/` and bridge files, offers repairs.

```bash
npx agent-ctx doctor                  # Diagnosis only
npx agent-ctx doctor --fix            # Auto-repair
```

## Global Flags

| Flag | Description |
|------|-------------|
| `-q, --quiet` | Suppress non-essential output |
| `-v, --version` | Show version |
| `-h, --help` | Show help |

## Project Configuration

Create an `.agent-ctx.json` file in your project root:

```json
{
  "editors": ["cursor", "claude", "copilot"],
  "language": "en",
  "backups": true
}
```

## Generated Structure

```
your-project/
├── .context/
│   ├── architecture.md       # Stack and project structure
│   ├── project_state.md      # Current state, TODOs, bugs
│   ├── rules/
│   │   └── coding-standards.md
│   ├── skills/
│   │   └── _template_skill.md
│   ├── docs/
│   │   └── README.md
│   └── mcp/
│       └── README.md
├── AGENTS.md                 # Master index for agents
├── CLAUDE.md                 # Instructions for Claude
├── .cursorrules              # Bridge for Cursor
├── .windsurfrules            # Bridge for Windsurf
├── .clinerules               # Bridge for Cline
├── .roomodes                 # Bridge for Roo
└── .github/
    └── copilot-instructions.md  # Bridge for GitHub Copilot
```

## Contributing

Found a bug or have an idea? Feel free to open an issue or PR.

## License

MIT © avicdro
