/**
 * Logger - Output utilities with colors and quiet mode support
 */

import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import figlet from 'figlet';

// Global logger state
let quietMode = false;
let currentSpinner: Ora | null = null;

/**
 * Sets quiet mode
 */
export function setQuietMode(enabled: boolean): void {
  quietMode = enabled;
}

/**
 * Checks if quiet mode is enabled
 */
export function isQuiet(): boolean {
  return quietMode;
}

interface QuietSpinner {
  succeed: () => void;
  fail: () => void;
  warn: () => void;
  stop: () => void;
  text: string;
}

export const logger = {
  // === Basic messages ===

  info: (msg: string): void => {
    if (!quietMode) console.log(chalk.blue('› ') + msg);
  },

  success: (msg: string): void => {
    if (!quietMode) console.log(chalk.green('✔ ') + msg);
  },

  warning: (msg: string): void => {
    // Warnings siempre se muestran
    console.log(chalk.yellow('⚠ ') + chalk.yellow(msg));
  },

  error: (msg: string): void => {
    // Errores siempre se muestran
    console.log(chalk.red('✖ ') + chalk.red(msg));
  },

  skip: (msg: string): void => {
    if (!quietMode) console.log(chalk.gray('›  ') + chalk.gray(msg));
  },

  // === Dry-run ===

  dryRun: (msg: string): void => {
    if (!quietMode) console.log(chalk.cyan('[DRY] ') + chalk.cyan(msg));
  },

  // === Headers decorativos ===

  header: (title: string): void => {
    if (quietMode) return;
    const line = '─'.repeat(Math.max(40, title.length + 4));
    console.log(chalk.blue(title));
    console.log(chalk.gray(line));
  },

  logo: (): void => {
    if (quietMode) return;
    console.log(
      chalk.blue(
        figlet.textSync('agent-ctx', {
          font: 'Standard',
          horizontalLayout: 'default',
          verticalLayout: 'default',
        })
      )
    );
  },

  // === Secciones ===

  section: (title: string): void => {
    if (!quietMode) console.log('\n' + chalk.blue(`${title}`));
  },

  // === Divider line ===

  divider: (): void => {
    if (!quietMode) console.log(chalk.gray('─'.repeat(50)));
  },

  // === Items de lista ===

  item: (text: string, indent: number = 1): void => {
    if (quietMode) return;
    const padding = '   '.repeat(indent);
    console.log(padding + chalk.gray('• ') + text);
  },

  // === Box de resumen ===

  summary: (title: string, isSuccess: boolean = true): void => {
    if (quietMode) return;
    const color = isSuccess ? chalk.green : chalk.cyan;
    const symbol = isSuccess ? '✔' : 'ℹ';

    console.log('');
    console.log(color(`${symbol} ${title}`));
  },

  // === Line breaks ===

  newline: (): void => {
    if (!quietMode) console.log('');
  },

  // === Raw output (respeta quiet) ===

  log: (msg: string): void => {
    if (!quietMode) console.log(msg);
  },

  // === Clear console ===

  clear: (): void => {
    if (!quietMode) {
      process.stdout.write('\x1Bc');
    }
  },

  // === Box decorativo simplificado ===

  box: (lines: string[], color: 'green' | 'blue' | 'cyan' = 'blue'): void => {
    if (quietMode) return;
    const colorFn = color === 'green' ? chalk.green : color === 'cyan' ? chalk.cyan : chalk.blue;
    console.log('');
    for (const line of lines) {
      console.log(colorFn(`  ${line}`));
    }
    console.log('');
  },
};

// === Spinners ===

/**
 * Creates a spinner with message
 */
export function startSpinner(text: string): Ora | QuietSpinner {
  if (quietMode) {
    return {
      succeed: () => {},
      fail: () => {},
      warn: () => {},
      stop: () => {},
      text: '',
    };
  }

  currentSpinner = ora({
    text,
    color: 'blue',
    spinner: 'dots',
  }).start();

  return currentSpinner;
}

/**
 * Stops the current spinner with success
 */
export function succeedSpinner(text?: string): void {
  if (currentSpinner && !quietMode) {
    currentSpinner.succeed(text);
    currentSpinner = null;
  }
}

/**
 * Stops the current spinner with error
 */
export function failSpinner(text?: string): void {
  if (currentSpinner) {
    currentSpinner.fail(text);
    currentSpinner = null;
  }
}

/**
 * Stops the current spinner with warning
 */
export function warnSpinner(text?: string): void {
  if (currentSpinner) {
    currentSpinner.warn(text);
    currentSpinner = null;
  }
}
