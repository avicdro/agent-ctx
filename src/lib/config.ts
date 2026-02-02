/**
 * Config - Manejo de configuración del proyecto
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { logger } from './logger.js';
import type { SupportedLanguage } from './i18n.js';

// Nombre del archivo de configuración
const CONFIG_FILENAME = '.agentrc.json';

export interface AgentrcConfig {
  editors: string[];
  language: SupportedLanguage;
  backups: boolean;
  customTemplates: string | null;
}

// Configuración por defecto
const DEFAULT_CONFIG: AgentrcConfig = {
  editors: ['cursor', 'antigravity', 'cline', 'roo', 'claude', 'copilot'],
  language: 'en',
  backups: true,
  customTemplates: null
};

/**
 * Carga la configuración del proyecto
 */
export function loadConfig(projectDir: string): AgentrcConfig {
  const configPath = join(projectDir, CONFIG_FILENAME);
  
  if (!existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }
  
  try {
    const content = readFileSync(configPath, 'utf-8');
    const userConfig = JSON.parse(content) as Partial<AgentrcConfig>;
    
    // Fusionar con defaults
    return {
      ...DEFAULT_CONFIG,
      ...userConfig
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warning(`Error al leer ${CONFIG_FILENAME}: ${message}`);
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Verifica si existe un archivo de configuración
 */
export function hasConfig(projectDir: string): boolean {
  return existsSync(join(projectDir, CONFIG_FILENAME));
}

/**
 * Obtiene la configuración por defecto
 */
export function getDefaultConfig(): AgentrcConfig {
  return { ...DEFAULT_CONFIG };
}

/**
 * Mapeo de nombres de archivos bridge a nombres de editor
 */
export const EDITOR_MAP: Record<string, string> = {
  '.cursorrules': 'cursor',
  '.antigravityrules': 'antigravity',
  '.clinerules': 'cline',
  '.roomodes': 'roo',
  'CLAUDE.md': 'claude',
  '.github/copilot-instructions.md': 'copilot'
};

/**
 * Filtra los editores según la configuración
 */
export function filterEditorsByConfig(allEditors: string[], config: AgentrcConfig): string[] {
  if (!config.editors || config.editors.length === 0) {
    return allEditors;
  }
  
  return allEditors.filter(editor => {
    // Obtener el nombre del editor desde el archivo
    const editorName = EDITOR_MAP[editor] || editor;
    return config.editors.includes(editorName);
  });
}

