/**
 * Comando: add
 * Descarga e instala skills desde npm
 */

import { logger } from '../lib/logger.js';

export interface AddOptions {
  directory?: string;
}

/**
 * Ejecuta el comando add
 */
export async function addCommand(
  _skillName: string | undefined,
  _options: AddOptions
): Promise<void> {
  logger.warning('🚧 Comando en desarrollo / Command under development');
  logger.log(
    '\nEl comando "add" está siendo refactorizado para soportar repositorios git y URLs directas.'
  );
  logger.log('The "add" command is being refactored to support git repositories and direct URLs.');
  logger.log(
    '\nPor ahora, por favor instala los skills manualmente o usa "init" para skills base.'
  );
  logger.log('For now, please install skills manually or use "init" for base skills.');

  process.exit(0);
}
