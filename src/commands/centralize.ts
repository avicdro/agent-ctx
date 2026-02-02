/**
 * Comando: centralize
 * Busca skills dispersas y las mueve a .context/skills/
 */

import { join, basename } from 'path';
import { existsSync, readdirSync, rmSync, renameSync, statSync } from 'fs';

import { logger, startSpinner, succeedSpinner, warnSpinner } from '../lib/logger.js';
import { resolveDirectory, validateNotRoot, ensureDir, EDITOR_FOLDERS } from '../lib/utils.js';

export interface CentralizeOptions {
  dryRun?: boolean;
}

/**
 * Ejecuta el comando centralize
 */
export async function centralizeCommand(directory: string, options: CentralizeOptions): Promise<void> {
  try {
    const targetDir = resolveDirectory(directory);
    validateNotRoot(targetDir);
    
    const { dryRun = false } = options;
    
    // Header
    logger.header('🔄 Iniciando centralización de Skills');
    logger.log(`\n📁 Directorio de trabajo: ${targetDir}`);
    
    if (dryRun) {
      logger.log('🔍 Modo DRY-RUN (solo simulación)');
    }
    
    const contextDir = join(targetDir, '.context');
    const skillsDir = join(contextDir, 'skills');
    const rulesDir = join(contextDir, 'rules');
    
    // Crear directorios si no existen
    if (!dryRun) {
      ensureDir(skillsDir, { dryRun });
      ensureDir(rulesDir, { dryRun });
    }
    
    // Buscar skills dispersas
    const spinner = startSpinner('Buscando skills dispersas...');
    
    let foundSkills = 0;
    const processedFolders = [];
    
    for (const folder of EDITOR_FOLDERS) {
      const folderPath = join(targetDir, folder);
      const sourceSkills = join(folderPath, 'skills');
      
      if (!existsSync(sourceSkills)) continue;
      
      processedFolders.push(folder);
      
      // Listar skills en la carpeta
      const items = readdirSync(sourceSkills);
      
      for (const item of items) {
        const itemPath = join(sourceSkills, item);
        const stat = statSync(itemPath);
        
        if (!stat.isDirectory()) continue;
        
        const targetPath = join(skillsDir, item);
        foundSkills++;
        
        if (existsSync(targetPath)) {
          if (dryRun) {
            logger.dryRun(`Eliminaría copia redundante: ${item}`);
          } else {
            rmSync(itemPath, { recursive: true });
          }
        } else {
          if (dryRun) {
            logger.dryRun(`Movería: ${item} → .context/skills/`);
          } else {
            renameSync(itemPath, targetPath);
          }
        }
      }
      
      if (!dryRun) {
        // Limpiar carpeta skills vacía
        try {
          rmSync(sourceSkills, { recursive: true });
        } catch {}
        
        // Intentar borrar carpeta del editor si quedó vacía
        try {
          const remaining = readdirSync(folderPath);
          if (remaining.length === 0) {
            rmSync(folderPath, { recursive: true });
          }
        } catch {}
      }
    }
    
    if (foundSkills === 0) {
      succeedSpinner('No se encontraron skills dispersas');
    } else {
      succeedSpinner(`Procesadas ${foundSkills} skills de ${processedFolders.length} carpeta(s)`);
      
      if (!dryRun) {
        logger.newline();
        for (const folder of processedFolders) {
          logger.item(`📦 ${folder}/ → .context/skills/`);
        }
      }
    }
    
    // Resumen final
    if (dryRun) {
      logger.summary('🔍 SIMULACIÓN COMPLETADA', false);
      logger.log('\nEjecuta sin --dry-run para aplicar los cambios.');
    } else {
      logger.summary('🎉 ¡Centralización completada!');
      logger.log('\n📁 Tu proyecto ahora usa una arquitectura limpia en .context/');
    }
    
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(message);
    process.exit(1);
  }
}
