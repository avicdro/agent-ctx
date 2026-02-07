/**
 * Config - Project configuration management
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';
import type { SupportedLanguage } from './i18n.js';

// Configuration file name
const CONFIG_FILENAME = '.agent-ctx.json';

/**
 * Gets the CLI version from package.json
 */
export function getCliVersion(): string {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    // From dist/lib/ or src/lib/, package.json is at root
    const pkgPath = join(__dirname, '../../package.json');
    const srcPkgPath = join(__dirname, '../../../package.json');
    const actualPath = existsSync(pkgPath) ? pkgPath : srcPkgPath;
    const pkg = JSON.parse(readFileSync(actualPath, 'utf-8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export interface AgentCtxConfig {
  // Editor bridges
  editors: string[];
  // UI language
  language: SupportedLanguage;
  // Create backups on overwrite
  backups: boolean;
  // Custom templates path (optional)
  customTemplates: string | null;
  // Installed base skills (template keys, e.g. "skills/skill-generating.md")
  skills: string[];
  // Installed rules (template keys, e.g. "rules/rule-coding-standards.md")
  rules: string[];
  // Recommended MCPs (just tracking, user manages them)
  mcps: string[];
  // CLI version that created/updated this config
  version: string;
}

// Default configuration
const DEFAULT_CONFIG: AgentCtxConfig = {
  editors: [],
  language: 'en',
  backups: true,
  customTemplates: null,
  skills: [],
  rules: [],
  mcps: [],
  version: getCliVersion(),
};

/**
 * Loads project configuration
 */
export function loadConfig(projectDir: string): AgentCtxConfig {
  const configPath = join(projectDir, CONFIG_FILENAME);

  if (!existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    const userConfig = JSON.parse(content) as Partial<AgentCtxConfig>;

    // Merge with defaults (ensures new fields get default values)
    return {
      ...DEFAULT_CONFIG,
      ...userConfig,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warning(`Error reading ${CONFIG_FILENAME}: ${message}`);
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Saves project configuration
 */
export function saveConfig(projectDir: string, config: AgentCtxConfig): void {
  const configPath = join(projectDir, CONFIG_FILENAME);
  const content = JSON.stringify(config, null, 2);
  writeFileSync(configPath, content, 'utf-8');
}

/**
 * Checks if a configuration file exists
 */
export function hasConfig(projectDir: string): boolean {
  return existsSync(join(projectDir, CONFIG_FILENAME));
}

/**
 * Gets the default configuration
 */
export function getDefaultConfig(): AgentCtxConfig {
  return { ...DEFAULT_CONFIG };
}

/**
 * Bridge file name to editor name mapping
 */
export const EDITOR_MAP: Record<string, string> = {
  '.cursorrules': 'cursor',
  '.antigravityrules': 'antigravity',
  '.clinerules': 'cline',
  '.roomodes': 'roo',
  'CLAUDE.md': 'claude',
  '.github/copilot-instructions.md': 'copilot',
};

/**
 * Filters editors based on configuration
 */
export function filterEditorsByConfig(allEditors: string[], config: AgentCtxConfig): string[] {
  if (!config.editors || config.editors.length === 0) {
    return allEditors;
  }

  return allEditors.filter((editor) => {
    // Get editor name from file
    const editorName = EDITOR_MAP[editor] || editor;
    return config.editors.includes(editorName);
  });
}
