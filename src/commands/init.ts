/**
 * Comando: init
 * Inicializa la estructura .context y archivos puente
 */

import { join } from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';

import { logger, startSpinner, succeedSpinner, failSpinner } from '../lib/logger.js';
import { resolveDirectory, validateNotRoot, ensureDir, writeFile } from '../lib/utils.js';
import { copyTemplate, TEMPLATE_MAPPINGS, BASE_SKILLS, MEMORY_BANK, BOOTSTRAP_TEMPLATE } from '../lib/templates.js';
import { BRIDGE_FILES } from '../lib/bridges.js';
import { setLanguage, LANGUAGES, t, type SupportedLanguage } from '../lib/i18n.js';

export interface InitOptions {
  yes?: boolean;
  force?: boolean;
  dryRun?: boolean;
}

/**
 * Ejecuta el comando init
 */
export async function initCommand(directory: string, options: InitOptions): Promise<void> {
  try {
    const targetDir = resolveDirectory(directory);
    validateNotRoot(targetDir);
    
    const { yes = false, force = false, dryRun = false } = options;
    
    // Determinar idioma (antes de cualquier otra cosa)
    let selectedLanguage: SupportedLanguage = 'en'; // Default: English
    
    if (!yes && !dryRun) {
      const langAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'language',
          message: t('prompt.selectLanguage'),
          choices: Object.entries(LANGUAGES).map(([code, name]) => ({
            name: name,
            value: code
          })),
          default: 'en'
        }
      ]);
      selectedLanguage = langAnswer.language as SupportedLanguage;
    }
    
    setLanguage(selectedLanguage);
    
    // Clear and show header
    logger.clear();
    logger.logo();
    logger.header(t('init.header'));
    
    logger.log(`\n${t('init.targetDir')} ${chalk.gray(targetDir)}\n`);
    
    if (force) {
      logger.warning(t('init.modeForce'));
    }
    if (yes) {
      logger.log(t('init.modeNonInteractive'));
    }
    if (dryRun) {
      logger.log(t('init.modeDryRun'));
    }
    
    // Determinar tipo de inicialización
    let initType: 'quick' | 'custom' = 'quick';
    let selectedEditors: string[] = [];
    
    if (!yes && !dryRun) {
      const initTypeAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'initType',
          message: t('prompt.selectInitType'),
          choices: [
            { name: t('init.quickStart'), value: 'quick' },
            { name: t('init.customBridges'), value: 'custom' }
          ],
          default: 'quick'
        }
      ]);
      initType = initTypeAnswer.initType;
      
      // Solo mostrar selección de bridges si elige personalizado
      if (initType === 'custom') {
        logger.log('');
        logger.warning(t('init.bridgesNotNeeded'));
        logger.log('');
        
        const answers = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'editors',
            message: t('prompt.selectEditors'),
            choices: Object.entries(BRIDGE_FILES).map(([file, config]) => ({
              name: config.name,
              value: file,
              checked: true
            }))
          }
        ]);
        selectedEditors = answers.editors;
      }
    }
    
    // Preguntar por AI Bootstrap Prompt (si no es dry-run y interactivo)
    // En modo 'quick' con --yes, asumimos TRUE por defecto (para ayudar al usuario)
    let createBootstrap = initType === 'quick';
    
    if (!yes && !dryRun) {
      const bootstrapAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'createBootstrap',
          message: t('prompt.bootstrap'),
          default: true
        }
      ]);
      createBootstrap = bootstrapAnswer.createBootstrap;
    }
    
    // 1. Crear estructura .context
    startSpinner(t('spinner.creatingContext'));
    
    const contextDir = join(targetDir, '.context');
    const subDirs = ['rules', 'skills', 'docs', 'mcp', 'memory'];
    
    ensureDir(contextDir, { dryRun, silent: true });
    
    for (const subDir of subDirs) {
      const subPath = join(contextDir, subDir);
      ensureDir(subPath, { dryRun, silent: true });
    }
    
    succeedSpinner(t('spinner.contextCreated'));
    
    // 2. Copiar templates
    startSpinner(t('spinner.copyingTemplates'));
    
    for (const [templateName, config] of Object.entries(TEMPLATE_MAPPINGS)) {
      const destPath = config.isRoot 
        ? join(targetDir, config.dest)
        : join(targetDir, config.dest);
      
      copyTemplate(templateName, destPath, { force, dryRun, silent: true });
    }
    
    succeedSpinner(t('spinner.templatesCopied'));
    
    // 2.5. Instalar BASE_SKILLS (skills fundamentales con estructura de carpetas)
    startSpinner('Installing base skills...');
    
    for (const [templateName, config] of Object.entries(BASE_SKILLS)) {
      const destPath = join(targetDir, config.dest);
      copyTemplate(templateName, destPath, { force, dryRun, silent: true });
    }
    
    succeedSpinner(`Base skills installed (${Object.keys(BASE_SKILLS).length} skills)`);
    
    // 2.6. Instalar Memory Bank (persistencia de contexto)
    startSpinner('Installing Memory Bank...');
    
    for (const [templateName, config] of Object.entries(MEMORY_BANK)) {
      const destPath = join(targetDir, config.dest);
      copyTemplate(templateName, destPath, { force, dryRun, silent: true });
    }
    
    succeedSpinner(`Memory Bank installed (${Object.keys(MEMORY_BANK).length} files)`);
    
    // 3. Crear archivos puente (solo si se eligió modo personalizado)
    if (initType === 'custom' && selectedEditors.length > 0) {
      startSpinner(t('spinner.generatingBridges'));
      
      for (const [file, config] of Object.entries(BRIDGE_FILES)) {
        if (!selectedEditors.includes(file)) continue;
        
        // Crear directorio si es necesario
        if (config.needsDir) {
          ensureDir(join(targetDir, config.needsDir), { dryRun, silent: true });
        }
        
        const filePath = join(targetDir, file);
        const content = config.generator();
        writeFile(filePath, content, { force, dryRun, silent: true });
      }
      
      succeedSpinner(t('spinner.bridgesGenerated', { count: selectedEditors.length }));
    }
    
    // 4. Crear AI Bootstrap Prompt (si se solicitó)
    if (createBootstrap) {
      const destPath = join(targetDir, BOOTSTRAP_TEMPLATE.dest);
      copyTemplate('base/_bootstrap.md', destPath, { force, dryRun, silent: true });
      logger.log('');
      logger.success(t('init.bootstrapGenerated'));
    }
    
    // Resumen final
    if (dryRun) {
      logger.summary(t('summary.simulationComplete'), false);
      logger.log(`\n${t('summary.runWithoutDryRun')}\n`);
    } else {
      logger.summary(t('summary.initComplete'), true);
      
      logger.log(`\n${t('summary.projectConfigured')} ${chalk.green(targetDir)}\n`);
      
      logger.log(t('summary.nextSteps'));
      logger.item(t('summary.step1'));
      logger.item(t('summary.step2'));
      logger.item(t('summary.step3'));
      logger.log('');
    }
    
  } catch (error) {
    failSpinner(t('error.initFailed'));
    const message = error instanceof Error ? error.message : String(error);
    logger.error(message);
    process.exit(1);
  }
}
