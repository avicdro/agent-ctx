/**
 * Comando: update
 * Regenera archivos puente sin tocar .context/
 */

import { join } from 'path';
import { existsSync } from 'fs';
import inquirer from 'inquirer';

import { logger, startSpinner, succeedSpinner } from '../lib/logger.js';
import { resolveDirectory, validateNotRoot, ensureDir, writeFile } from '../lib/utils.js';
import { BRIDGE_FILES } from '../lib/bridges.js';

export interface UpdateOptions {
  yes?: boolean;
  force?: boolean;
}

/**
 * Ejecuta el comando update
 */
export async function updateCommand(directory: string, options: UpdateOptions): Promise<void> {
  try {
    const targetDir = resolveDirectory(directory);
    validateNotRoot(targetDir);
    
    const { yes, force } = options;
    
    // Header
    logger.header('🔄 Actualización de archivos puente');
    logger.log(`\n📁 Directorio: ${targetDir}`);
    
    // Determinar qué editores actualizar
    let selectedEditors = Object.keys(BRIDGE_FILES);
    
    if (!yes) {
      // Mostrar cuáles existen actualmente
      const existing = [];
      const missing = [];
      
      for (const [file, config] of Object.entries(BRIDGE_FILES)) {
        const filePath = join(targetDir, file);
        if (existsSync(filePath)) {
          existing.push({ file, config });
        } else {
          missing.push({ file, config });
        }
      }
      
      if (existing.length > 0) {
        logger.log('\n📋 Archivos puente existentes:');
        for (const { file, config } of existing) {
          logger.item(`✅ ${file} (${config.name})`);
        }
      }
      
      if (missing.length > 0) {
        logger.log('\n📋 Archivos puente faltantes:');
        for (const { file, config } of missing) {
          logger.item(`⚪ ${file} (${config.name})`);
        }
      }
      
      const answers = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'editors',
          message: '¿Qué archivos puente quieres actualizar/crear?',
          choices: Object.entries(BRIDGE_FILES).map(([file, config]) => ({
            name: `${config.name} (${file})`,
            value: file,
            checked: existsSync(join(targetDir, file))
          }))
        }
      ]);
      selectedEditors = answers.editors;
      
      if (selectedEditors.length === 0) {
        logger.success('No se seleccionó ningún archivo. Operación cancelada.');
        return;
      }
    }
    
    // Actualizar archivos puente
    const spinner = startSpinner('Actualizando archivos puente...');
    
    let updated = 0;
    for (const [file, config] of Object.entries(BRIDGE_FILES)) {
      if (!selectedEditors.includes(file)) continue;
      
      // Crear directorio si es necesario
      if (config.needsDir) {
        ensureDir(join(targetDir, config.needsDir), { dryRun: false });
      }
      
      const filePath = join(targetDir, file);
      const content = config.generator();
      
      // Usar force:true porque el usuario eligió explícitamente actualizar
      writeFile(filePath, content, { force: true, dryRun: false });
      updated++;
    }
    
    succeedSpinner(`${updated} archivo(s) puente actualizados`);
    
    // Resumen
    logger.summary('✨ Actualización completada');
    logger.log('\nTus archivos puente ahora usan la última versión de agentrc.');
    
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(message);
    process.exit(1);
  }
}
