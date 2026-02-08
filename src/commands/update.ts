/**
 * Command: update
 * Updates bridge files and offers to install new base skills from CLI
 */

import { join } from 'path';
import { existsSync } from 'fs';
import inquirer from 'inquirer';
import chalk from 'chalk';

import { logger, startSpinner, succeedSpinner, failSpinner } from '../lib/logger.js';
import { resolveDirectory, validateNotRoot, ensureDir, writeFile } from '../lib/utils.js';
import { BRIDGE_FILES } from '../lib/bridges.js';
import {
  loadConfig,
  saveConfig,
  hasConfig,
  getCliVersion,
  type AgentCtxConfig,
} from '../lib/config.js';
import { BASE_SKILLS, TEMPLATE_MAPPINGS, copyTemplate } from '../lib/templates.js';
import { t } from '../lib/i18n.js';

export interface UpdateOptions {
  yes?: boolean;
}

/**
 * Executes the update command
 */
export async function updateCommand(directory: string, options: UpdateOptions): Promise<void> {
  try {
    const targetDir = resolveDirectory(directory);
    validateNotRoot(targetDir);

    const { yes } = options;

    // Load configuration
    const configExists = hasConfig(targetDir);
    const config = loadConfig(targetDir);

    // Header
    logger.header(`🔄 ${t('update.header')}`);
    logger.log(`\n📁 ${t('update.directory')} ${targetDir}`);

    if (!configExists) {
      logger.warning(`⚠️  ${t('update.noConfig')}`);
      process.exit(1);
    }

    logger.log(
      chalk.dim(
        `📄 ${t('update.configVersion', { old: config.version || 'unknown', new: getCliVersion() })}`
      )
    );

    // ====== 1. DETECTAR NUEVOS SKILLS BASE ======
    const newSkillsAvailable: Array<{ key: string; name: string; dest: string }> = [];

    for (const [skillKey, skillConfig] of Object.entries(BASE_SKILLS)) {
      if (!config.skills.includes(skillKey)) {
        newSkillsAvailable.push({
          key: skillKey,
          name: skillConfig.name || skillKey,
          dest: skillConfig.dest,
        });
      }
    }

    // ====== 2. DETECTAR NUEVAS RULES BASE ======
    const newRulesAvailable: Array<{ key: string; dest: string }> = [];

    for (const [templateKey, templateConfig] of Object.entries(TEMPLATE_MAPPINGS)) {
      if (templateKey.startsWith('rules/') && !config.rules.includes(templateKey)) {
        newRulesAvailable.push({
          key: templateKey,
          dest: templateConfig.dest,
        });
      }
    }

    const installedSkills: string[] = [];
    const installedRules: string[] = [];

    // ====== 3. OFRECER INSTALAR NUEVOS SKILLS ======
    if (newSkillsAvailable.length > 0) {
      logger.log(`\n📦 ${chalk.yellow(t('update.newSkillsAvailable'))}`);
      for (const skill of newSkillsAvailable) {
        logger.item(`${skill.name} ${chalk.dim(t('update.recommended'))}`);
      }

      logger.log(chalk.dim(`\n${t('update.existingSkillsNote')}`));

      let installNewSkills = yes; // With --yes, install automatically

      if (!yes) {
        const answer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'install',
            message: t('update.installNewSkills'),
            default: true,
          },
        ]);
        installNewSkills = answer.install;
      }

      if (installNewSkills) {
        startSpinner(t('update.installingSkills'));

        for (const skill of newSkillsAvailable) {
          const destPath = join(targetDir, skill.dest);
          // force: false to NOT overwrite if user created something manually
          copyTemplate(skill.key, destPath, {
            force: false,
            dryRun: false,
            silent: true,
            backup: config.backups,
          });
          installedSkills.push(skill.key);
        }

        succeedSpinner(t('update.skillsInstalled', { count: installedSkills.length }));
      }
    } else {
      logger.log(`\n✅ ${t('update.allSkillsInstalled')}`);
    }

    // ====== 4. OFRECER INSTALAR NUEVAS RULES ======
    if (newRulesAvailable.length > 0) {
      logger.log(`\n📜 ${chalk.yellow(t('update.newRulesAvailable'))}`);
      for (const rule of newRulesAvailable) {
        logger.item(rule.key.replace('rules/', ''));
      }

      let installNewRules = yes;

      if (!yes) {
        const answer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'install',
            message: t('update.installNewRules'),
            default: true,
          },
        ]);
        installNewRules = answer.install;
      }

      if (installNewRules) {
        startSpinner(t('update.installingRules'));

        for (const rule of newRulesAvailable) {
          const destPath = join(targetDir, rule.dest);
          copyTemplate(rule.key, destPath, {
            force: false,
            dryRun: false,
            silent: true,
            backup: config.backups,
          });
          installedRules.push(rule.key);
        }

        succeedSpinner(t('update.rulesInstalled', { count: installedRules.length }));
      }
    } else {
      logger.log(`✅ ${t('update.allRulesInstalled')}`);
    }

    // ====== 5. ACTUALIZAR BRIDGES (comportamiento original) ======
    let selectedEditors: string[] = [];

    if (!yes) {
      // Show which ones currently exist
      const existing: Array<{ file: string; config: (typeof BRIDGE_FILES)[string] }> = [];
      const missing: Array<{ file: string; config: (typeof BRIDGE_FILES)[string] }> = [];

      for (const [file, bridgeConfig] of Object.entries(BRIDGE_FILES)) {
        const filePath = join(targetDir, file);
        if (existsSync(filePath)) {
          existing.push({ file, config: bridgeConfig });
        } else {
          missing.push({ file, config: bridgeConfig });
        }
      }

      if (existing.length > 0 || missing.length > 0) {
        logger.log(`\n📋 ${t('update.bridgeFiles')}`);
        for (const { file, config: c } of existing) {
          logger.item(`✅ ${file} (${c.name})`);
        }
        for (const { file, config: c } of missing) {
          logger.item(`⚪ ${file} (${c.name})`);
        }
      }

      const answers = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'editors',
          message: t('update.selectBridges'),
          choices: Object.entries(BRIDGE_FILES).map(([file, c]) => ({
            name: `${c.name} (${file})`,
            value: file,
            checked: existsSync(join(targetDir, file)),
          })),
        },
      ]);
      selectedEditors = answers.editors;
    } else {
      // Con --yes, actualiza todos los existentes
      selectedEditors = Object.keys(BRIDGE_FILES).filter((file) =>
        existsSync(join(targetDir, file))
      );
    }

    if (selectedEditors.length > 0) {
      startSpinner(t('update.updatingBridges'));

      let updated = 0;
      for (const [file, configBridge] of Object.entries(BRIDGE_FILES)) {
        if (!selectedEditors.includes(file)) continue;

        if (configBridge.needsDir) {
          ensureDir(join(targetDir, configBridge.needsDir), {
            dryRun: false,
            backup: config.backups,
          });
        }

        const filePath = join(targetDir, file);
        const content = configBridge.generator();

        writeFile(filePath, content, { force: true, dryRun: false, backup: config.backups });
        updated++;
      }

      succeedSpinner(t('update.bridgesUpdated', { count: updated }));
    }

    // ====== 6. SAVE UPDATED CONFIGURATION ======
    if (installedSkills.length > 0 || installedRules.length > 0) {
      const updatedConfig: AgentCtxConfig = {
        ...config,
        skills: [...new Set([...config.skills, ...installedSkills])],
        rules: [...new Set([...config.rules, ...installedRules])],
        version: getCliVersion(),
      };

      saveConfig(targetDir, updatedConfig);
      logger.log(`\n📄 ${t('update.configUpdated')}`);
    }

    // Summary
    logger.summary(`✨ ${t('update.complete')}`);
    logger.log(`\n${t('update.projectUpToDate')}`);
  } catch (error) {
    failSpinner(t('update.error'));
    const message = error instanceof Error ? error.message : String(error);
    logger.error(message);
    process.exit(1);
  }
}
