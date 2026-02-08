/**
 * Command: doctor
 * Checks integrity of .context and bridge files, offers repairs
 */

import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

import { logger, startSpinner, succeedSpinner, warnSpinner, failSpinner } from '../lib/logger.js';
import { resolveDirectory, validateNotRoot, ensureDir } from '../lib/utils.js';
import { BRIDGE_FILES, type BridgeConfig } from '../lib/bridges.js';
import { loadConfig, hasConfig } from '../lib/config.js';
import { BASE_SKILLS, copyTemplate } from '../lib/templates.js';

export interface DoctorOptions {
  fix?: boolean;
}
interface Issue {
  type:
    | 'missing_dir'
    | 'missing_file'
    | 'outdated_bridge'
    | 'missing_bridge'
    | 'missing_skill'
    | 'missing_rule'
    | 'orphan_skill'
    | 'no_config';
  path: string;
  name: string;
  optional?: boolean;
  config?: BridgeConfig;
  templateKey?: string;
}

/**
 * Executes the doctor command
 */
export async function doctorCommand(directory: string, options: DoctorOptions): Promise<void> {
  try {
    const targetDir = resolveDirectory(directory);
    validateNotRoot(targetDir);

    const { fix = false } = options;

    // Header
    logger.header('🩺 Project Diagnostics');
    logger.log(`\n📁 Directory: ${targetDir}`);

    if (fix) {
      logger.log('🔧 FIX mode: will automatically repair issues');
    }

    const issues: Issue[] = [];
    const newSkillsInfo: Array<{ name: string; key: string }> = []; // Informational only, NOT issues

    // 0. Check configuration
    const configExists = hasConfig(targetDir);
    const config = loadConfig(targetDir);

    if (!configExists) {
      logger.warning('⚠️  No .agent-ctx.json found - run `agent-ctx init` first');
      issues.push({
        type: 'no_config',
        path: join(targetDir, '.agent-ctx.json'),
        name: '.agent-ctx.json',
        optional: false,
      });
    } else {
      logger.log('📄 Config loaded from .agent-ctx.json');
    }

    // 1. Check .context structure
    startSpinner('Checking .context/ structure...');

    const requiredDirs = [
      { path: '.context', name: '.context/' },
      { path: '.context/rules', name: '.context/rules/' },
      { path: '.context/skills', name: '.context/skills/' },
      { path: '.context/docs', name: '.context/docs/' },
      { path: '.context/mcp', name: '.context/mcp/' },
      { path: '.context/memory', name: '.context/memory/' },
    ];

    let dirIssues = 0;
    for (const dir of requiredDirs) {
      const fullPath = join(targetDir, dir.path);
      if (!existsSync(fullPath)) {
        dirIssues++;
        issues.push({
          type: 'missing_dir',
          path: fullPath,
          name: dir.name,
        });
      }
    }

    if (dirIssues === 0) {
      succeedSpinner('Estructura .context/ completa');
    } else {
      warnSpinner(`Missing ${dirIssues} directory(ies) in .context/`);
    }

    // 2. Check basic context files
    startSpinner('Checking context files...');

    const requiredFiles = [
      { path: 'AGENTS.md', name: 'AGENTS.md' },
      { path: '.context/architecture.md', name: 'architecture.md' },
      { path: '.context/project_state.md', name: 'project_state.md' },
      { path: '.context/rules/coding-standards.md', name: 'coding-standards.md' },
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
          optional: true,
        });
      }
    }

    if (fileIssues === 0) {
      succeedSpinner('Context files complete');
    } else {
      warnSpinner(`Missing ${fileIssues} context file(s) (optional)`);
    }

    // 3. Verify registered skills in config vs actual files
    if (configExists) {
      startSpinner('Verifying installed skills...');

      let skillsMissing = 0;
      let skillsOk = 0;

      // Check registered skills exist
      for (const skillKey of config.skills) {
        const skillConfig = BASE_SKILLS[skillKey];
        if (skillConfig) {
          const destPath = join(targetDir, skillConfig.dest);
          if (existsSync(destPath)) {
            skillsOk++;
          } else {
            skillsMissing++;
            issues.push({
              type: 'missing_skill',
              path: destPath,
              name: skillConfig.name || skillKey,
              templateKey: skillKey,
            });
          }
        }
      }

      // Check for NEW skills in CLI not registered in config (informational only)
      let newSkills = 0;
      for (const [skillKey, skillConfig] of Object.entries(BASE_SKILLS)) {
        if (!config.skills.includes(skillKey)) {
          newSkills++;
          newSkillsInfo.push({
            name: skillConfig.name || skillKey,
            key: skillKey,
          });
        }
      }

      if (skillsMissing === 0 && newSkills === 0) {
        succeedSpinner(`${skillsOk} skills verified`);
      } else if (skillsMissing > 0) {
        warnSpinner(`${skillsOk} OK, ${skillsMissing} missing, ${newSkills} new available`);
      } else {
        succeedSpinner(`${skillsOk} skills OK - ${newSkills} new available from CLI`);
      }
    }

    // 4. Verify bridge files
    startSpinner('Verifying bridge files...');

    let bridgeOk = 0;
    let bridgeMissing = 0;
    let bridgeOutdated = 0;

    for (const [file, bridgeConfig] of Object.entries(BRIDGE_FILES)) {
      const fullPath = join(targetDir, file);

      if (existsSync(fullPath)) {
        // Verify that it contains references to .context
        const content = readFileSync(fullPath, 'utf-8');
        if (content.includes('.context') || content.includes('AGENTS.md')) {
          bridgeOk++;
        } else {
          bridgeOutdated++;
          issues.push({
            type: 'outdated_bridge',
            path: fullPath,
            name: file,
            config: bridgeConfig,
          });
        }
      } else {
        bridgeMissing++;
        issues.push({
          type: 'missing_bridge',
          path: fullPath,
          name: file,
          config: bridgeConfig,
        });
      }
    }

    if (bridgeMissing === 0 && bridgeOutdated === 0) {
      succeedSpinner(`${bridgeOk} bridge files configured`);
    } else {
      warnSpinner(`${bridgeOk} OK, ${bridgeMissing} missing, ${bridgeOutdated} outdated`);
    }

    // Summary
    logger.divider();

    const criticalIssues = issues.filter((i) => !i.optional && i.type !== 'missing_bridge');
    const optionalIssues = issues.filter((i) => i.optional || i.type === 'missing_bridge');

    if (issues.length === 0) {
      logger.summary('✅ All good!');
      logger.log('\nTu proyecto está correctamente configurado.');
      return;
    }

    logger.log(`\n📊 Summary:`);
    logger.log(`   - Critical issues: ${criticalIssues.length}`);
    logger.log(`   - Minor/optional issues: ${optionalIssues.length}`);

    if (newSkillsInfo.length > 0) {
      logger.log(`   - Nuevos skills disponibles: ${newSkillsInfo.length}`);
      logger.log('\n📦 New base skills available from CLI:');
      for (const skill of newSkillsInfo) {
        logger.item(`${skill.name}`);
      }
      logger.log('\n💡 Run `agent-ctx update` to install new skills.');
    }

    // Repair if requested (only structure and registered skills, NOT bridges)
    const fixableIssues = issues.filter(
      (i) => i.type === 'missing_dir' || i.type === 'missing_skill'
    );

    if (fix && fixableIssues.length > 0) {
      startSpinner('Applying repairs...');

      let fixed = 0;

      for (const issue of fixableIssues) {
        switch (issue.type) {
          case 'missing_dir':
            ensureDir(issue.path, { dryRun: false });
            fixed++;
            break;

          case 'missing_skill':
            if (issue.templateKey) {
              const skillConfig = BASE_SKILLS[issue.templateKey];
              if (skillConfig) {
                copyTemplate(issue.templateKey, issue.path, {
                  force: false,
                  dryRun: false,
                  silent: true,
                });
                fixed++;
              }
            }
            break;
        }
      }

      succeedSpinner(`${fixed} issue(s) repaired`);
      logger.summary('🔧 Repairs applied');

      // If there are bridge issues, indicate to use update
      const bridgeIssues = issues.filter(
        (i) => i.type === 'missing_bridge' || i.type === 'outdated_bridge'
      );
      if (bridgeIssues.length > 0) {
        logger.log('\n💡 To update bridge files, run `agent-ctx update`.');
      }
    } else if (fixableIssues.length > 0) {
      logger.log('\n💡 Run `agent-ctx doctor --fix` to repair structure and skills.');
    } else if (issues.length > 0) {
      logger.log('\n💡 Run `agent-ctx update` to manage bridge files.');
    }
  } catch (error) {
    failSpinner('Error during diagnostics');
    const message = error instanceof Error ? error.message : String(error);
    logger.error(message);
    process.exit(1);
  }
}
