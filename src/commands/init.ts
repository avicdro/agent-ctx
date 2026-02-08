/**
 * Command: init
 * Initializes .context structure and bridge files
 */

import { join } from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';

import { logger, startSpinner, succeedSpinner, failSpinner } from '../lib/logger.js';
import { resolveDirectory, validateNotRoot, ensureDir, writeFile } from '../lib/utils.js';
import {
  copyTemplate,
  TEMPLATE_MAPPINGS,
  BASE_SKILLS,
  MEMORY_BANK,
  BOOTSTRAP_TEMPLATE,
} from '../lib/templates.js';
import { BRIDGE_FILES } from '../lib/bridges.js';
import { setLanguage, LANGUAGES, t, type SupportedLanguage } from '../lib/i18n.js';
import {
  loadConfig,
  hasConfig,
  saveConfig,
  getCliVersion,
  EDITOR_MAP,
  type AgentCtxConfig,
} from '../lib/config.js';

export interface InitOptions {
  yes?: boolean;
  force?: boolean;
  dryRun?: boolean;
}

/**
 * Executes the init command
 */
export async function initCommand(directory: string, options: InitOptions): Promise<void> {
  try {
    const targetDir = resolveDirectory(directory);
    validateNotRoot(targetDir);

    const { yes = false, force = false, dryRun = false } = options;

    // Load existing configuration
    const existingConfig = loadConfig(targetDir);
    const hasExistingConfig = hasConfig(targetDir);

    // Track what we install for the final config
    const installedSkills: string[] = [];
    const installedRules: string[] = [];

    // Determine language (before anything else)
    let selectedLanguage: SupportedLanguage = existingConfig.language || 'en'; // Default: Config or English

    if (!yes && !dryRun && !hasExistingConfig) {
      const langAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'language',
          message: t('prompt.selectLanguage'),
          choices: Object.entries(LANGUAGES).map(([code, name]) => ({
            name: name,
            value: code,
          })),
          default: 'en',
        },
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
    if (hasExistingConfig) {
      logger.log(chalk.cyan(`📄 Config loaded from .agent-ctx.json`));
    }

    // Determine initialization type
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
            { name: t('init.customBridges'), value: 'custom' },
          ],
          default: 'quick',
        },
      ]);
      initType = initTypeAnswer.initType;

      // Only show bridge selection if custom mode is chosen
      if (initType === 'custom') {
        logger.log('');
        logger.warning(t('init.bridgesNotNeeded'));
        logger.log('');

        const answers = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'editors',
            message: t('prompt.selectEditors'),
            choices: Object.entries(BRIDGE_FILES).map(([file, configBridge]) => ({
              name: configBridge.name,
              value: file,
              checked:
                existingConfig.editors.includes(configBridge.name) ||
                existingConfig.editors.includes(file) ||
                existingConfig.editors.length === 0,
            })),
          },
        ]);
        selectedEditors = answers.editors;
      }
    }

    // Ask about AI Bootstrap Prompt (if not dry-run and interactive)
    // In 'quick' mode with --yes, we assume TRUE by default (to help the user)
    let createBootstrap = initType === 'quick';

    if (!yes && !dryRun) {
      const bootstrapAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'createBootstrap',
          message: t('prompt.bootstrap'),
          default: true,
        },
      ]);
      createBootstrap = bootstrapAnswer.createBootstrap;
    }

    // 1. Create .context structure
    startSpinner(t('spinner.creatingContext'));

    const contextDir = join(targetDir, '.context');
    const subDirs = ['rules', 'skills', 'docs', 'mcp', 'memory'];

    ensureDir(contextDir, { dryRun, silent: true, backup: existingConfig.backups });

    for (const subDir of subDirs) {
      const subPath = join(contextDir, subDir);
      ensureDir(subPath, { dryRun, silent: true, backup: existingConfig.backups });
    }

    succeedSpinner(t('spinner.contextCreated'));

    // 2. Copiar templates
    startSpinner(t('spinner.copyingTemplates'));

    for (const [templateName, templateConfig] of Object.entries(TEMPLATE_MAPPINGS)) {
      const destPath = templateConfig.isRoot
        ? join(targetDir, templateConfig.dest)
        : join(targetDir, templateConfig.dest);

      copyTemplate(templateName, destPath, {
        force,
        dryRun,
        silent: true,
        backup: existingConfig.backups,
      });

      // Track installed rules
      if (templateName.startsWith('rules/')) {
        installedRules.push(templateName);
      }
    }

    succeedSpinner(t('spinner.templatesCopied'));

    // 2.5. Install BASE_SKILLS (fundamental skills with folder structure)
    startSpinner('Installing base skills...');

    for (const [templateName, skillConfig] of Object.entries(BASE_SKILLS)) {
      const destPath = join(targetDir, skillConfig.dest);
      copyTemplate(templateName, destPath, {
        force,
        dryRun,
        silent: true,
        backup: existingConfig.backups,
      });
      installedSkills.push(templateName);
    }

    succeedSpinner(`Base skills installed (${Object.keys(BASE_SKILLS).length} skills)`);

    // 2.6. Install Memory Bank (context persistence)
    startSpinner('Installing Memory Bank...');

    for (const [templateName, memConfig] of Object.entries(MEMORY_BANK)) {
      const destPath = join(targetDir, memConfig.dest);
      copyTemplate(templateName, destPath, {
        force,
        dryRun,
        silent: true,
        backup: existingConfig.backups,
      });
    }

    succeedSpinner(`Memory Bank installed (${Object.keys(MEMORY_BANK).length} files)`);

    // 3. Create bridge files (only if custom mode was chosen)
    if (initType === 'custom' && selectedEditors.length > 0) {
      startSpinner(t('spinner.generatingBridges'));

      for (const [file, bridgeConfig] of Object.entries(BRIDGE_FILES)) {
        if (!selectedEditors.includes(file)) continue;

        // Create directory if needed
        if (bridgeConfig.needsDir) {
          ensureDir(join(targetDir, bridgeConfig.needsDir), {
            dryRun,
            silent: true,
            backup: existingConfig.backups,
          });
        }

        const filePath = join(targetDir, file);
        const content = bridgeConfig.generator();
        writeFile(filePath, content, {
          force,
          dryRun,
          silent: true,
          backup: existingConfig.backups,
        });
      }

      succeedSpinner(t('spinner.bridgesGenerated', { count: selectedEditors.length }));
    }

    // 4. Create AI Bootstrap Prompt (if requested)
    if (createBootstrap) {
      const destPath = join(targetDir, BOOTSTRAP_TEMPLATE.dest);
      copyTemplate('base/_bootstrap.md', destPath, {
        force,
        dryRun,
        silent: true,
        backup: existingConfig.backups,
      });
      logger.log('');
      logger.success(t('init.bootstrapGenerated'));
    }

    // 5. Save configuration (.agent-ctx.json)
    if (!dryRun) {
      // Convert bridge file paths to editor IDs
      const editorIds = selectedEditors
        .map((file) => EDITOR_MAP[file] || file)
        .filter((id, index, self) => self.indexOf(id) === index); // deduplicate

      const newConfig: AgentCtxConfig = {
        version: getCliVersion(),
        editors: editorIds,
        language: selectedLanguage,
        backups: existingConfig.backups,
        customTemplates: existingConfig.customTemplates,
        skills: [...new Set([...existingConfig.skills, ...installedSkills])],
        rules: [...new Set([...existingConfig.rules, ...installedRules])],
        mcps: existingConfig.mcps,
      };

      saveConfig(targetDir, newConfig);
      logger.log('');
      logger.success('Configuration saved to .agent-ctx.json');
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
