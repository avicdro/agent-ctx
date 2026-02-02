/**
 * Comando: clean
 * Elimina carpetas redundantes de editores
 */

import { join } from 'path';
import { existsSync, readdirSync, rmSync, statSync } from 'fs';
import inquirer from 'inquirer';

import { logger, startSpinner, succeedSpinner } from '../lib/logger.js';
import { resolveDirectory, validateNotRoot, WHITELIST } from '../lib/utils.js';

export interface CleanOptions {
  yes?: boolean;
  dryRun?: boolean;
}

/**
 * Ejecuta el comando clean
 */
export async function cleanCommand(directory: string, options: CleanOptions): Promise<void> {
  try {
    const targetDir = resolveDirectory(directory);
    validateNotRoot(targetDir);
    
    const { yes, dryRun } = options;
    
    // Header
    logger.header('🧹 Escaneo de carpetas de agentes redundantes');
    logger.log(`\n📁 Directorio de trabajo: ${targetDir}`);
    
    if (dryRun) {
      logger.log('🔍 Modo DRY-RUN (solo simulación)');
    }
    if (yes) {
      logger.log('🤖 Modo AUTO-CONFIRM');
    }
    
    // Buscar carpetas candidatas a borrar
    const spinner = startSpinner('Buscando carpetas redundantes...');
    
    const items = readdirSync(targetDir);
    const candidates = [];
    
    for (const item of items) {
      // Solo carpetas ocultas
      if (!item.startsWith('.')) continue;
      
      // Verificar lista blanca
      if (WHITELIST.includes(item)) continue;
      
      const itemPath = join(targetDir, item);
      
      try {
        const stat = statSync(itemPath);
        if (!stat.isDirectory()) continue;
      } catch {
        continue;
      }
      
      // Verificar si tiene skills o rules adentro
      const hasSkills = existsSync(join(itemPath, 'skills'));
      const hasRules = existsSync(join(itemPath, 'rules'));
      
      if (hasSkills || hasRules) {
        candidates.push({
          path: itemPath,
          name: item,
          contents: [hasSkills && 'skills', hasRules && 'rules'].filter(Boolean).join(', ')
        });
      }
    }
    
    // Verificar si encontramos algo
    if (candidates.length === 0) {
      succeedSpinner('¡Todo limpio! No se encontraron carpetas redundantes');
      return;
    }
    
    succeedSpinner(`Encontradas ${candidates.length} carpeta(s) redundantes`);
    
    // Listar candidatos
    logger.newline();
    logger.divider();
    
    for (const candidate of candidates) {
      logger.log(`   ❌ ${candidate.name}  (contiene: ${candidate.contents})`);
    }
    
    logger.divider();
    
    // Modo dry-run
    if (dryRun) {
      logger.dryRun('Se eliminarían las carpetas listadas arriba.');
      logger.log('Ejecuta sin --dry-run para aplicar los cambios.');
      return;
    }
    
    // Confirmación
    if (!yes) {
      logger.log('\n⚠️  Estas carpetas NO son \'.context\' y parecen ser generadas por herramientas externas.');
      
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: '¿Estás seguro de que deseas ELIMINAR estas carpetas permanentemente?',
          default: false
        }
      ]);
      
      if (!confirm) {
        logger.success('🛑 Operación cancelada. No se ha borrado nada.');
        return;
      }
    }
    
    // Eliminar
    const deleteSpinner = startSpinner('Eliminando carpetas...');
    
    for (const candidate of candidates) {
      rmSync(candidate.path, { recursive: true });
    }
    
    succeedSpinner(`Eliminadas ${candidates.length} carpeta(s)`);
    
    // Resumen final
    logger.summary('✨ Limpieza completada exitosamente');
    logger.log(`\nAhora solo usa '.context/'.`);
    
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(message);
    process.exit(1);
  }
}
