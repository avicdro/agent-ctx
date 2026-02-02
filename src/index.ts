/**
 * agentrc - CLI Principal
 * Registra todos los comandos y maneja la ejecución
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { initCommand } from './commands/init.js';
import { centralizeCommand } from './commands/centralize.js';
import { cleanCommand } from './commands/clean.js';
import { doctorCommand } from './commands/doctor.js';
import { updateCommand } from './commands/update.js';
import { addCommand } from './commands/add.js';
import { setQuietMode } from './lib/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer versión desde package.json
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

export function run() {
  const program = new Command();

  program
    .name('agent-ctx')
    .description('CLI tool to initialize and manage AI agent context for your projects')
    .version(pkg.version, '-v, --version', 'Show version number')
    .option('-q, --quiet', 'Suppress non-essential output')
    .hook('preAction', (thisCommand) => {
      const opts = thisCommand.opts();
      if (opts.quiet) {
        setQuietMode(true);
      }
    });

  // Comando: init
  program
    .command('init [directory]')
    .description('Initialize .context structure and bridge files')
    .option('-y, --yes', 'Non-interactive mode (accept all defaults)')
    .option('-f, --force', 'Overwrite existing files')
    .option('--dry-run', 'Show what would be done without executing')
    .action(initCommand);

  // Comando: centralize
  program
    .command('centralize [directory]')
    .description('Find and move scattered skills to .context/skills/')
    .option('--dry-run', 'Show what would be done without executing')
    .action(centralizeCommand);

  // Comando: clean
  program
    .command('clean [directory]')
    .description('Remove redundant editor folders that duplicate skills/rules')
    .option('-y, --yes', 'Delete without confirmation')
    .option('--dry-run', 'Show what would be done without executing')
    .action(cleanCommand);

  // Comando: doctor
  program
    .command('doctor [directory]')
    .description('Check integrity of .context and bridge files, offer repairs')
    .option('--fix', 'Automatically fix issues found')
    .action(doctorCommand);

  // Comando: update
  program
    .command('update [directory]')
    .description('Regenerate bridge files with latest templates')
    .option('-y, --yes', 'Non-interactive mode (update all)')
    .option('-f, --force', 'Force update even if files exist')
    .action(updateCommand);

  // Comando: add
  program
    .command('add <skill-name>')
    .description('Download and install a skill from npm')
    .option('-d, --directory <dir>', 'Target project directory', '.')
    .action(addCommand);

  // Parsear argumentos
  program.parse();
}
