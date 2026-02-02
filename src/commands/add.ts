/**
 * Comando: add
 * Descarga e instala skills desde npm
 */

import { join, basename } from 'path';
import { existsSync, cpSync, rmSync, readdirSync, statSync } from 'fs';
import { execSync } from 'child_process';
import * as tar from 'tar';

import { logger, startSpinner, succeedSpinner, failSpinner, warnSpinner } from '../lib/logger.js';
import { resolveDirectory, validateNotRoot, ensureDir } from '../lib/utils.js';

export interface AddOptions {
  directory?: string;
}

/**
 * Ejecuta el comando add
 */
export async function addCommand(skillName: string | undefined, options: AddOptions): Promise<void> {
  logger.warning('🚧 Comando en desarrollo / Command under development');
  logger.log('\nEl comando "add" está siendo refactorizado para soportar repositorios git y URLs directas.');
  logger.log('The "add" command is being refactored to support git repositories and direct URLs.');
  logger.log('\nPor ahora, por favor instala los skills manualmente o usa "init" para skills base.');
  logger.log('For now, please install skills manually or use "init" for base skills.');
  
  process.exit(0);
}
