/**
 * Command: clean
 * Removes redundant editor folders
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
 * Executes the clean command
 */
export async function cleanCommand(directory: string, options: CleanOptions): Promise<void> {
  try {
    const targetDir = resolveDirectory(directory);
    validateNotRoot(targetDir);

    const { yes, dryRun } = options;

    // Header
    logger.header('🧹 Scanning for redundant agent folders');
    logger.log(`\n📁 Working directory: ${targetDir}`);

    if (dryRun) {
      logger.log('🔍 DRY-RUN mode (simulation only)');
    }
    if (yes) {
      logger.log('🤖 Modo AUTO-CONFIRM');
    }

    // Find folders to delete
    startSpinner('Searching for redundant folders...');

    const items = readdirSync(targetDir);
    const candidates = [];

    for (const item of items) {
      // Only hidden folders
      if (!item.startsWith('.')) continue;

      // Check whitelist
      if (WHITELIST.includes(item)) continue;

      const itemPath = join(targetDir, item);

      try {
        const stat = statSync(itemPath);
        if (!stat.isDirectory()) continue;
      } catch {
        continue;
      }

      // Check if it has skills or rules inside
      const hasSkills = existsSync(join(itemPath, 'skills'));
      const hasRules = existsSync(join(itemPath, 'rules'));

      if (hasSkills || hasRules) {
        candidates.push({
          path: itemPath,
          name: item,
          contents: [hasSkills && 'skills', hasRules && 'rules'].filter(Boolean).join(', '),
        });
      }
    }

    // Check if we found anything
    if (candidates.length === 0) {
      succeedSpinner('All clean! No redundant folders found');
      return;
    }

    succeedSpinner(`Found ${candidates.length} redundant folder(s)`);

    // List candidates
    logger.newline();
    logger.divider();

    for (const candidate of candidates) {
      logger.log(`   ❌ ${candidate.name}  (contains: ${candidate.contents})`);
    }

    logger.divider();

    // Dry-run mode
    if (dryRun) {
      logger.dryRun('The folders listed above would be deleted.');
      logger.log('Run without --dry-run to apply changes.');
      return;
    }

    // Confirmation
    if (!yes) {
      logger.log(
        "\n⚠️  Estas carpetas NO son '.context' y parecen ser generadas por herramientas externas."
      );

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Are you sure you want to PERMANENTLY DELETE these folders?',
          default: false,
        },
      ]);

      if (!confirm) {
        logger.success('🛑 Operation cancelled. Nothing was deleted.');
        return;
      }
    }

    // Delete
    startSpinner('Deleting folders...');

    for (const candidate of candidates) {
      rmSync(candidate.path, { recursive: true });
    }

    succeedSpinner(`Deleted ${candidates.length} folder(s)`);

    // Final summary
    logger.summary('✨ Cleanup completed successfully');
    logger.log(`\nAhora solo usa '.context/'.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(message);
    process.exit(1);
  }
}
