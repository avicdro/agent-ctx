/**
 * Comando: doctor
 * Verifica integridad de .context y archivos puente, ofrece reparaciones
 */

import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

import { logger, startSpinner, succeedSpinner, warnSpinner, failSpinner } from '../lib/logger.js';
import { resolveDirectory, validateNotRoot, ensureDir, writeFile } from '../lib/utils.js';
import { BRIDGE_FILES, type BridgeConfig } from '../lib/bridges.js';

export interface DoctorOptions {
  fix?: boolean;
}

interface Issue {
  type: 'missing_dir' | 'missing_file' | 'outdated_bridge' | 'missing_bridge';
  path: string;
  name: string;
  optional?: boolean;
  config?: BridgeConfig;
}

/**
 * Ejecuta el comando doctor
 */
export async function doctorCommand(directory: string, options: DoctorOptions): Promise<void> {
  try {
    const targetDir = resolveDirectory(directory);
    validateNotRoot(targetDir);
    
    const { fix = false } = options;
    
    // Header
    logger.header('🩺 Diagnóstico del proyecto');
    logger.log(`\n📁 Directorio: ${targetDir}`);
    
    if (fix) {
      logger.log('🔧 Modo FIX: reparará problemas automáticamente');
    }
    
    const issues: Issue[] = [];
    const contextDir = join(targetDir, '.context');
    
    // 1. Verificar estructura .context
    const spinner1 = startSpinner('Verificando estructura .context/...');
    
    const requiredDirs = [
      { path: '.context', name: '.context/' },
      { path: '.context/rules', name: '.context/rules/' },
      { path: '.context/skills', name: '.context/skills/' },
      { path: '.context/docs', name: '.context/docs/' },
      { path: '.context/mcp', name: '.context/mcp/' }
    ];
    
    let dirIssues = 0;
    for (const dir of requiredDirs) {
      const fullPath = join(targetDir, dir.path);
      if (!existsSync(fullPath)) {
        dirIssues++;
        issues.push({
          type: 'missing_dir',
          path: fullPath,
          name: dir.name
        });
      }
    }
    
    if (dirIssues === 0) {
      succeedSpinner('Estructura .context/ completa');
    } else {
      warnSpinner(`Faltan ${dirIssues} directorio(s) en .context/`);
    }
    
    // 2. Verificar archivos de contexto
    const spinner2 = startSpinner('Verificando archivos de contexto...');
    
    const requiredFiles = [
      { path: 'AGENTS.md', name: 'AGENTS.md' },
      { path: '.context/architecture.md', name: 'architecture.md' },
      { path: '.context/project_state.md', name: 'project_state.md' },
      { path: '.context/rules/coding-standards.md', name: 'coding-standards.md' }
    ];
    
    let fileIssues = 0;
    for (const file of requiredFiles) {
      const fullPath = join(targetDir, file.path);
      if (!existsSync(fullPath)) {
        fileIssues++;
        issues.push({
          type: 'missing_file',
          path: fullPath,
          name: file.name,
          optional: true
        });
      }
    }
    
    if (fileIssues === 0) {
      succeedSpinner('Archivos de contexto completos');
    } else {
      warnSpinner(`Faltan ${fileIssues} archivo(s) de contexto (opcionales)`);
    }
    
    // 3. Verificar archivos puente
    const spinner3 = startSpinner('Verificando archivos puente...');
    
    let bridgeOk = 0;
    let bridgeMissing = 0;
    let bridgeOutdated = 0;
    
    for (const [file, config] of Object.entries(BRIDGE_FILES)) {
      const fullPath = join(targetDir, file);
      
      if (existsSync(fullPath)) {
        // Verificar que contenga referencias a .context
        const content = readFileSync(fullPath, 'utf-8');
        if (content.includes('.context') || content.includes('AGENTS.md')) {
          bridgeOk++;
        } else {
          bridgeOutdated++;
          issues.push({
            type: 'outdated_bridge',
            path: fullPath,
            name: file,
            config
          });
        }
      } else {
        bridgeMissing++;
        issues.push({
          type: 'missing_bridge',
          path: fullPath,
          name: file,
          config
        });
      }
    }
    
    if (bridgeMissing === 0 && bridgeOutdated === 0) {
      succeedSpinner(`${bridgeOk} archivos puente configurados`);
    } else {
      warnSpinner(`${bridgeOk} OK, ${bridgeMissing} faltan, ${bridgeOutdated} desactualizados`);
    }
    
    // Resumen
    logger.divider();
    
    const criticalIssues = issues.filter(i => !i.optional && i.type !== 'missing_bridge');
    const optionalIssues = issues.filter(i => i.optional || i.type === 'missing_bridge');
    
    if (issues.length === 0) {
      logger.summary('✅ ¡Todo en orden!');
      logger.log('\nTu proyecto está correctamente configurado.');
      return;
    }
    
    logger.log(`\n📊 Resumen:`);
    logger.log(`   - Problemas críticos: ${criticalIssues.length}`);
    logger.log(`   - Problemas menores/opcionales: ${optionalIssues.length}`);
    
    // Reparar si se solicitó
    if (fix && issues.length > 0) {
      const fixSpinner = startSpinner('Aplicando reparaciones...');
      
      let fixed = 0;
      for (const issue of issues) {
        switch (issue.type) {
          case 'missing_dir':
            ensureDir(issue.path, { dryRun: false });
            fixed++;
            break;
            
          case 'outdated_bridge':
          case 'missing_bridge':
            if (issue.config) {
              if (issue.config.needsDir) {
                ensureDir(join(targetDir, issue.config.needsDir), { dryRun: false });
              }
              const content = issue.config.generator();
              writeFile(issue.path, content, { force: true, dryRun: false });
              fixed++;
            }
            break;
        }
      }
      
      succeedSpinner(`${fixed} problema(s) reparado(s)`);
      logger.summary('🔧 Reparaciones aplicadas');
    } else if (issues.length > 0) {
      logger.log('\n💡 Ejecuta `agentrc doctor --fix` para reparar automáticamente.');
    }
    
  } catch (error) {
    failSpinner('Error durante diagnóstico');
    const message = error instanceof Error ? error.message : String(error);
    logger.error(message);
    process.exit(1);
  }
}
