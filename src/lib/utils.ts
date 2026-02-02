/**
 * @fileoverview Utilidades comunes para operaciones de archivos y directorios
 * @module lib/utils
 */

import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'fs';
import { resolve, basename } from 'path';
import { logger } from './logger.js';

export interface FileOperationOptions {
  force?: boolean;
  dryRun?: boolean;
  silent?: boolean;
  backup?: boolean;
}

/**
 * Resuelve y valida que un directorio exista
 */
export function resolveDirectory(dir: string = '.'): string {
  const resolved = resolve(dir);
  
  if (!existsSync(resolved)) {
    throw new Error(`El directorio '${dir}' no existe.`);
  }
  
  return resolved;
}

/**
 * Valida que no estemos en la raíz del sistema
 */
export function validateNotRoot(dir: string): boolean {
  const normalized = resolve(dir);
  
  // Windows: C:\, D:\, etc.
  if (/^[A-Z]:\\?$/i.test(normalized)) {
    throw new Error('No se puede ejecutar en la raíz del sistema.');
  }
  
  // Unix: /
  if (normalized === '/') {
    throw new Error('No se puede ejecutar en la raíz del sistema.');
  }
  
  return true;
}

/**
 * Crea un directorio si no existe
 */
export function ensureDir(dir: string, options: FileOperationOptions = {}): boolean {
  const { dryRun = false, silent = false } = options;
  
  if (existsSync(dir)) {
    return false;
  }
  
  if (dryRun) {
    if (!silent) logger.dryRun(`Create dir: ${dir}`);
    return true;
  }
  
  mkdirSync(dir, { recursive: true });
  return true;
}

/**
 * Copia un archivo con opciones de force y backup
 */
export function copyFile(src: string, dest: string, options: FileOperationOptions = {}): boolean {
  const { force = false, dryRun = false, silent = false, backup = true } = options;
  const name = basename(dest);
  
  if (!existsSync(src)) {
    logger.warning(`Template not found: ${src}`);
    return false;
  }
  
  if (existsSync(dest) && !force) {
    if (!silent) logger.item(`${name} (exists, skipped)`);
    return false;
  }
  
  if (dryRun) {
    if (!silent) logger.dryRun(`Copy: ${name}`);
    return true;
  }
  
  // Create parent directories if needed (for skill folder structure)
  const parentDir = dest.substring(0, dest.lastIndexOf('/'));
  if (parentDir && !existsSync(parentDir)) {
    mkdirSync(parentDir, { recursive: true });
  }
  
  // Crear backup si existe y hay force, y los backups están habilitados
  if (existsSync(dest) && force && backup) {
    copyFileSync(dest, `${dest}.bak`);
    if (!silent) logger.item(`${name}.bak (backup created)`);
  }
  
  copyFileSync(src, dest);
  if (!silent) logger.item(`+ ${name}`);
  return true;
}

/**
 * Escribe contenido a un archivo con opciones de force y backup
 */
export function writeFile(path: string, content: string, options: FileOperationOptions = {}): boolean {
  const { force = false, dryRun = false, silent = false, backup = true } = options;
  const name = basename(path);
  
  if (existsSync(path) && !force) {
    if (!silent) logger.item(`${name} (exists, skipped)`);
    return false;
  }
  
  if (dryRun) {
    if (!silent) logger.dryRun(`Create: ${name}`);
    return true;
  }
  
  // Crear backup si existe y hay force, y los backups están habilitados
  if (existsSync(path) && force && backup) {
    copyFileSync(path, `${path}.bak`);
    if (!silent) logger.item(`${name}.bak (backup created)`);
  }
  
  writeFileSync(path, content, 'utf-8');
  if (!silent) logger.item(`+ ${name}`);
  return true;
}

/**
 * Lista de carpetas de editores conocidas que pueden contener skills/rules
 */
export const EDITOR_FOLDERS: string[] = [
  '.agent', '.agents', '.cursor', '.windsurf', '.gemini', '.cline',
  '.vscode', '.codebuddy', '.claude', '.adal', '.augment', '.codex',
  '.commandcode', '.continue', '.copilot', '.factory', '.junie',
  '.kilocode', '.kiro', '.kode', '.mcpjam', '.moltbot', '.mux',
  '.neovate', '.openclaude', '.openhands', '.pochi', '.qoder',
  '.qwen', '.roo', '.trae-cn', '.trae', '.vibe', '.zencoder'
];

/**
 * Lista blanca de carpetas a preservar durante limpieza
 */
export const WHITELIST: string[] = ['.context', '.git', '.github'];

