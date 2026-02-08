/**
 * @fileoverview Common utilities for file and directory operations
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
 * Resolves and validates that a directory exists
 */
export function resolveDirectory(dir: string = '.'): string {
  const resolved = resolve(dir);

  if (!existsSync(resolved)) {
    throw new Error(`Directory '${dir}' does not exist.`);
  }

  return resolved;
}

/**
 * Validates that we are not at the system root
 */
export function validateNotRoot(dir: string): boolean {
  const normalized = resolve(dir);

  // Windows: C:\, D:\, etc.
  if (/^[A-Z]:\\?$/i.test(normalized)) {
    throw new Error('Cannot run at system root.');
  }

  // Unix: /
  if (normalized === '/') {
    throw new Error('Cannot run at system root.');
  }

  return true;
}

/**
 * Creates a directory if it does not exist
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
 * Copies a file with force and backup options
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
  const parentDir = resolve(dest, '..');
  if (!existsSync(parentDir)) {
    mkdirSync(parentDir, { recursive: true });
  }

  // Create backup if file exists, force is enabled, and backups are enabled
  if (existsSync(dest) && force && backup) {
    copyFileSync(dest, `${dest}.bak`);
    if (!silent) logger.item(`${name}.bak (backup created)`);
  }

  copyFileSync(src, dest);
  if (!silent) logger.item(`+ ${name}`);
  return true;
}

/**
 * Writes content to a file with force and backup options
 */
export function writeFile(
  path: string,
  content: string,
  options: FileOperationOptions = {}
): boolean {
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
 * List of known editor folders that may contain skills/rules
 */
export const EDITOR_FOLDERS: string[] = [
  '.agent',
  '.agents',
  '.cursor',
  '.windsurf',
  '.gemini',
  '.cline',
  '.vscode',
  '.codebuddy',
  '.claude',
  '.adal',
  '.augment',
  '.codex',
  '.commandcode',
  '.continue',
  '.copilot',
  '.factory',
  '.junie',
  '.kilocode',
  '.kiro',
  '.kode',
  '.mcpjam',
  '.moltbot',
  '.mux',
  '.neovate',
  '.openclaude',
  '.openhands',
  '.pochi',
  '.qoder',
  '.qwen',
  '.roo',
  '.trae-cn',
  '.trae',
  '.vibe',
  '.zencoder',
];

/**
 * Whitelist of folders to preserve during cleanup
 */
export const WHITELIST: string[] = ['.context', '.git', '.github'];
