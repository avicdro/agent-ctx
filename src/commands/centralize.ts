/**
 * Command: centralize
 * Finds scattered skills and moves them to .context/skills/
 */

import { join } from 'path';
import { existsSync, readdirSync, rmSync, renameSync, statSync } from 'fs';

import { logger, startSpinner, succeedSpinner } from '../lib/logger.js';
import { resolveDirectory, validateNotRoot, ensureDir, EDITOR_FOLDERS } from '../lib/utils.js';

export interface CentralizeOptions {
  dryRun?: boolean;
}

/**
 * Executes the centralize command
 */
export async function centralizeCommand(
  directory: string,
  options: CentralizeOptions
): Promise<void> {
  try {
    const targetDir = resolveDirectory(directory);
    validateNotRoot(targetDir);

    const { dryRun = false } = options;

    // Header
    logger.header('🔄 Starting Skills centralization');
    logger.log(`\n📁 Working directory: ${targetDir}`);

    if (dryRun) {
      logger.log('🔍 DRY-RUN mode (simulation only)');
    }

    const contextDir = join(targetDir, '.context');
    const skillsDir = join(contextDir, 'skills');
    const rulesDir = join(contextDir, 'rules');

    // Create directories if they don't exist
    if (!dryRun) {
      ensureDir(skillsDir, { dryRun });
      ensureDir(rulesDir, { dryRun });
    }

    // Find scattered skills
    startSpinner('Searching for scattered skills...');

    let foundSkills = 0;
    const processedFolders = [];

    for (const folder of EDITOR_FOLDERS) {
      const folderPath = join(targetDir, folder);
      const sourceSkills = join(folderPath, 'skills');

      if (!existsSync(sourceSkills)) continue;

      processedFolders.push(folder);

      // List skills in folder
      const items = readdirSync(sourceSkills);

      for (const item of items) {
        const itemPath = join(sourceSkills, item);
        const stat = statSync(itemPath);

        if (!stat.isDirectory()) continue;

        const targetPath = join(skillsDir, item);
        foundSkills++;

        if (existsSync(targetPath)) {
          if (dryRun) {
            logger.dryRun(`Would delete redundant copy: ${item}`);
          } else {
            rmSync(itemPath, { recursive: true });
          }
        } else {
          if (dryRun) {
            logger.dryRun(`Would move: ${item} → .context/skills/`);
          } else {
            renameSync(itemPath, targetPath);
          }
        }
      }

      if (!dryRun) {
        // Clean empty skills folder
        try {
          rmSync(sourceSkills, { recursive: true });
        } catch {}

        // Try to delete editor folder if empty
        try {
          const remaining = readdirSync(folderPath);
          if (remaining.length === 0) {
            rmSync(folderPath, { recursive: true });
          }
        } catch {}
      }
    }

    if (foundSkills === 0) {
      succeedSpinner('No scattered skills found');
    } else {
      succeedSpinner(`Processed ${foundSkills} skills from ${processedFolders.length} folder(s)`);

      if (!dryRun) {
        logger.newline();
        for (const folder of processedFolders) {
          logger.item(`📦 ${folder}/ → .context/skills/`);
        }
      }
    }

    // Final summary
    if (dryRun) {
      logger.summary('🔍 SIMULATION COMPLETE', false);
      logger.log('\nRun without --dry-run to apply changes.');
    } else {
      logger.summary('🎉 Centralization complete!');
      logger.log('\n📁 Your project now uses a clean architecture in .context/');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(message);
    process.exit(1);
  }
}
