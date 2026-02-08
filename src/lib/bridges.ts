/**
 * @fileoverview Bridge file generation for different editors/AI agents
 * @module lib/bridges
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { t } from './i18n.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8')) as {
  version: string;
};

const VERSION: string = pkg.version;

export interface BridgeConfig {
  name: string;
  generator: () => string;
  needsDir?: string;
}

/**
 * Generates content for .cursor/rules/global.md (new format with frontmatter)
 */
export function getCursorGlobalRules(): string {
  return `---
description: "Global project rules and context from .context/"
globs: "**/*"
alwaysApply: true
---
# ${t('bridge.generatedBy', { version: VERSION })}

${t('bridge.readAgents')}

## Context Structure

This project uses a centralized context structure in \`.context/\`:

- **Architecture:** .context/architecture.md
- **Rules:** .context/rules/
- **Skills:** .context/skills/
- **Docs:** .context/docs/
- **Project State:** .context/project_state.md

Please read AGENTS.md for the complete project overview.
`;
}

// Legacy generators removed - editors now read AGENTS.md directly

/**
 * Generates content for CLAUDE.md for Claude Code
 */
export function getClaudeMd(): string {
  return `# Claude Code Context
# ${t('bridge.generatedBy', { version: VERSION })}

## ${t('bridge.copilotInstructions')}

${t('bridge.claudeIntro')}
${t('bridge.claudeReadContext')}

1. **${t('bridge.architecture')}** .context/architecture.md
2. **${t('bridge.rules')}** .context/rules/coding-standards.md
3. **${t('bridge.skills')}** .context/skills/
4. **Project State:** .context/project_state.md

## ${t('bridge.principles')}

- ${t('bridge.followRules')}
- ${t('bridge.usePatterns')}
- ${t('bridge.maintainConsistency')}`;
}

/**
 * Generates content for .github/copilot-instructions.md for GitHub Copilot (global)
 */
export function getCopilotInstructions(): string {
  return `# GitHub Copilot Instructions
# ${t('bridge.generatedBy', { version: VERSION })}

## ${t('bridge.copilotContext')}

${t('bridge.copilotContextDesc')}

## ${t('bridge.copilotInstructions')}

1. ${t('bridge.copilotReadAgents')}
2. ${t('bridge.copilotFollowRules')}
3. ${t('bridge.copilotUsePatterns')}

## ${t('bridge.mainRules')}

- ${t('bridge.useStrictTS')}
- ${t('bridge.followNaming')}
- ${t('bridge.addErrorHandling')}`;
}

/**
 * Generates content for .github/instructions/context.instructions.md (scoped)
 */
export function getCopilotContextInstructions(): string {
  return `---
applyTo: "**/*"
---
# Project Context Instructions
# ${t('bridge.generatedBy', { version: VERSION })}

This project uses a centralized context structure in \`.context/\`.

Before making any changes, please review:
- **AGENTS.md** - Project overview and guidelines
- **.context/architecture.md** - Technical architecture
- **.context/rules/** - Coding standards
- **.context/project_state.md** - Current state and TODOs
`;
}

// Aider conventions generator removed - reads AGENTS.md directly

/**
 * Generates content for .agent/rules/context.md for Antigravity
 */
export function getAntigravityRules(): string {
  return `# Project Context Rules
# ${t('bridge.generatedBy', { version: VERSION })}

## ${t('bridge.copilotInstructions')}

${t('bridge.antigravityIntro')}

This project uses a centralized context structure in \`.context/\`:

- **Architecture:** .context/architecture.md
- **Rules:** .context/rules/
- **Skills:** .context/skills/
- **Docs:** .context/docs/
- **Project State:** .context/project_state.md
- **Memory Bank:** .context/memory/

## ${t('bridge.principles')}

- ${t('bridge.followRules')}
- ${t('bridge.usePatterns')}
- ${t('bridge.maintainConsistency')}

Please read AGENTS.md for the complete project overview.
`;
}

/**
 * Map of all available bridge files (only modern formats)
 * Legacy formats have been removed - editors now read AGENTS.md directly
 */
export const BRIDGE_FILES: Record<string, BridgeConfig> = {
  // Cursor - Modern format with frontmatter
  '.cursor/rules/global.md': {
    name: 'Cursor (Modern)',
    generator: getCursorGlobalRules,
    needsDir: '.cursor/rules',
  },
  // Claude Code
  'CLAUDE.md': {
    name: 'Claude Code',
    generator: getClaudeMd,
  },
  // Copilot - Global
  '.github/copilot-instructions.md': {
    name: 'GitHub Copilot (Global)',
    generator: getCopilotInstructions,
    needsDir: '.github',
  },
  // Copilot - Scoped
  '.github/instructions/context.instructions.md': {
    name: 'GitHub Copilot (Scoped)',
    generator: getCopilotContextInstructions,
    needsDir: '.github/instructions',
  },
  // Antigravity - Project rules
  '.agent/rules/context.md': {
    name: 'Antigravity',
    generator: getAntigravityRules,
    needsDir: '.agent/rules',
  },
};
