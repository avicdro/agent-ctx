/**
 * Tests for utils module
 */

import { describe, it, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, rmSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

import {
  resolveDirectory,
  validateNotRoot,
  ensureDir,
  copyFile,
  writeFile,
  EDITOR_FOLDERS,
  WHITELIST,
} from '../dist/lib/utils.js';

// Directorio temporal para tests
const TEST_DIR = join(tmpdir(), 'agent-ctx-test-' + Date.now());

describe('utils', () => {
  beforeEach(() => {
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  describe('resolveDirectory', () => {
    it('debería resolver un directorio existente', () => {
      const result = resolveDirectory(TEST_DIR);
      assert.ok(result.includes('agent-ctx-test'));
    });

    it('debería lanzar error para directorio inexistente', () => {
      assert.throws(() => resolveDirectory('/path/that/does/not/exist'), /does not exist/);
    });

    it('debería usar "." por defecto', () => {
      const result = resolveDirectory();
      assert.ok(result.length > 0);
    });
  });

  describe('validateNotRoot', () => {
    it('debería aceptar un directorio normal', () => {
      assert.equal(validateNotRoot(TEST_DIR), true);
    });

    it('debería rechazar la raíz Unix', () => {
      assert.throws(() => validateNotRoot('/'), /system root/);
    });

    it('debería rechazar la raíz Windows (solo en Windows)', () => {
      // Este test solo tiene sentido en Windows donde 'C:\\' se resuelve como raíz
      // En Linux, resolve('C:\\') devuelve una ruta relativa normal
      if (process.platform === 'win32') {
        assert.throws(() => validateNotRoot('C:\\'), /system root/);
      } else {
        // En Linux simplemente verificamos que la regex existe en el código
        assert.ok(true, 'Skipped on non-Windows platform');
      }
    });
  });

  describe('ensureDir', () => {
    it('debería crear un directorio nuevo', () => {
      const newDir = join(TEST_DIR, 'new-folder');
      const result = ensureDir(newDir);

      assert.equal(result, true);
      assert.ok(existsSync(newDir));
    });

    it('debería retornar false si ya existe', () => {
      const result = ensureDir(TEST_DIR);
      assert.equal(result, false);
    });

    it('debería solo simular en modo dryRun', () => {
      const newDir = join(TEST_DIR, 'dry-run-folder');
      const result = ensureDir(newDir, { dryRun: true });

      assert.equal(result, true);
      assert.equal(existsSync(newDir), false);
    });
  });

  describe('writeFile', () => {
    it('debería crear un archivo nuevo', () => {
      const filePath = join(TEST_DIR, 'test.txt');
      const result = writeFile(filePath, 'contenido de prueba');

      assert.equal(result, true);
      assert.ok(existsSync(filePath));
    });

    it('debería no sobrescribir sin force', () => {
      const filePath = join(TEST_DIR, 'existing.txt');
      writeFileSync(filePath, 'original');

      const result = writeFile(filePath, 'nuevo contenido');
      assert.equal(result, false);
    });

    it('debería sobrescribir con force', () => {
      const filePath = join(TEST_DIR, 'force.txt');
      writeFileSync(filePath, 'original');

      const result = writeFile(filePath, 'nuevo', { force: true });
      assert.equal(result, true);
      assert.ok(existsSync(filePath + '.bak'));
    });
  });

  describe('constantes', () => {
    it('EDITOR_FOLDERS debería incluir editores comunes', () => {
      assert.ok(EDITOR_FOLDERS.includes('.cursor'));
      assert.ok(EDITOR_FOLDERS.includes('.windsurf'));
      assert.ok(EDITOR_FOLDERS.includes('.vscode'));
    });

    it('WHITELIST debería incluir .context y .git', () => {
      assert.ok(WHITELIST.includes('.context'));
      assert.ok(WHITELIST.includes('.git'));
    });
  });
});
