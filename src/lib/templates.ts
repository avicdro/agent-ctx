/**
 * @fileoverview Manejo de templates embebidos para generación de archivos
 * @module lib/templates
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { copyFile, type FileOperationOptions } from './utils.js';
import { getLanguage, type SupportedLanguage } from './i18n.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Templates are always in src/templates, whether code runs from src/ or dist/
// From dist/lib/, we need to go ../../src/templates
// From src/lib/, we need to go ../templates
const srcTemplates = join(__dirname, '../../src/templates');
const localTemplates = join(__dirname, '../templates');
const TEMPLATES_DIR: string = existsSync(srcTemplates) ? srcTemplates : localTemplates;

export interface TemplateMapping {
  dest: string;
  isRoot?: boolean;
  name?: string;
}

/**
 * Obtiene la ruta absoluta a un template, respetando el idioma actual
 */
export function getTemplatePath(name: string, lang?: SupportedLanguage): string {
  const language = lang || getLanguage();
  return join(TEMPLATES_DIR, language, name);
}

/**
 * Lee el contenido de un template
 */
export function readTemplate(name: string, lang?: SupportedLanguage): string {
  const path = getTemplatePath(name, lang);
  return readFileSync(path, 'utf-8');
}

/**
 * Copia un template a la ruta de destino
 */
export function copyTemplate(name: string, destPath: string, options: FileOperationOptions = {}): boolean {
  const srcPath = getTemplatePath(name);
  return copyFile(srcPath, destPath, options);
}

/**
 * Mapeo de templates disponibles a sus destinos
 */
export const TEMPLATE_MAPPINGS: Record<string, TemplateMapping> = {
  'base/_agents.md': { dest: 'AGENTS.md', isRoot: true },
  'base/_architecture.md': { dest: '.context/architecture.md' },
  'base/_project_state.md': { dest: '.context/project_state.md' },
  'rules/rule-coding-standards.md': { dest: '.context/rules/coding-standards.md' },
  'docs/doc-readme.md': { dest: '.context/docs/README.md' },
  'docs/mcp-readme.md': { dest: '.context/mcp/README.md' }
};

/**
 * Template opcional para bootstrap de IA (prompt de personalización)
 */
export const BOOTSTRAP_TEMPLATE: TemplateMapping = {
  dest: 'AI_BOOTSTRAP.md',
  isRoot: true,
  name: 'AI Bootstrap Prompt'
};


/**
 * Templates de skills que se instalan siempre (estructura de carpetas con SKILL.md)
 * Los skills base ayudan al agente a crear y mantener la estructura del proyecto
 */
export const BASE_SKILLS: Record<string, TemplateMapping> = {
  'skills/skill-generating.md': { dest: '.context/skills/generating-skills/SKILL.md', name: 'Generating Skills' },
  'skills/skill-agents.md': { dest: '.context/skills/managing-agents/SKILL.md', name: 'Managing Agents' },
  'skills/skill-architecture.md': { dest: '.context/skills/documenting-architecture/SKILL.md', name: 'Documenting Architecture' },
  'skills/skill-rules.md': { dest: '.context/skills/creating-rules/SKILL.md', name: 'Creating Rules' },
  'skills/skill-project-state.md': { dest: '.context/skills/tracking-project-state/SKILL.md', name: 'Tracking Project State' }
};

/**
 * Templates de skills opcionales que pueden instalarse (estructura de carpetas con SKILL.md)
 */
export const OPTIONAL_SKILLS: Record<string, TemplateMapping> = {
  'skills/skill-react.md': { dest: '.context/skills/react-patterns/SKILL.md', name: 'React Patterns' },
  'skills/skill-api.md': { dest: '.context/skills/api-design/SKILL.md', name: 'API Design' },
  'skills/skill-testing.md': { dest: '.context/skills/testing-practices/SKILL.md', name: 'Testing Practices' },
  'skills/skill-git.md': { dest: '.context/skills/git-workflow/SKILL.md', name: 'Git Workflow' }
};

/**
 * Templates de Memory Bank para persistencia de contexto
 * Basado en el patrón Memory Bank de Cline/Roo Code
 */
export const MEMORY_BANK: Record<string, TemplateMapping> = {
  'memory/project_brief.md': { dest: '.context/memory/project_brief.md', name: 'Project Brief' },
  'memory/tech_context.md': { dest: '.context/memory/tech_context.md', name: 'Tech Context' },
  'memory/active_context.md': { dest: '.context/memory/active_context.md', name: 'Active Context' },
  'memory/progress.md': { dest: '.context/memory/progress.md', name: 'Progress' }
};
