/**
 * Tests E2E para los comandos del CLI agent-ctx
 * 
 * Estos tests ejecutan los comandos reales del CLI y verifican
 * que producen los resultados esperados en el sistema de archivos.
 */

import { describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'child_process';
import { mkdirSync, rmSync, existsSync, readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, resolve } from 'path';

// Ruta al CLI compilado
const CLI_PATH = resolve(import.meta.dirname, '../../dist/bin/agent-ctx.js');

// Carpeta de pruebas E2E
const E2E_TEST_FOLDER = resolve(import.meta.dirname, '../../test_e2e_fold');

/**
 * Helper para ejecutar el CLI
 */
function runCLI(args, cwd = E2E_TEST_FOLDER) {
  try {
    const result = execSync(`node ${CLI_PATH} ${args}`, { 
      cwd, 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 30000
    });
    return { success: true, output: result };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || '', 
      error: error.stderr || error.message 
    };
  }
}

/**
 * Helper para limpiar la carpeta de pruebas
 */
function cleanTestFolder() {
  if (existsSync(E2E_TEST_FOLDER)) {
    rmSync(E2E_TEST_FOLDER, { recursive: true, force: true });
  }
  mkdirSync(E2E_TEST_FOLDER, { recursive: true });
}

describe('E2E: CLI Commands', () => {
  // Crear carpeta de pruebas antes de todos los tests
  before(() => {
    cleanTestFolder();
  });

  // Limpiar después de todos los tests
  after(() => {
    if (existsSync(E2E_TEST_FOLDER)) {
      rmSync(E2E_TEST_FOLDER, { recursive: true, force: true });
    }
  });

  describe('init command', () => {
    beforeEach(() => {
      cleanTestFolder();
    });

    it('debería crear la estructura .context con --yes', () => {
      const result = runCLI('init . --yes');
      
      assert.ok(result.success, 'El comando debería completarse exitosamente');
      
      // Verificar estructura de directorios
      assert.ok(existsSync(join(E2E_TEST_FOLDER, '.context')), '.context debería existir');
      assert.ok(existsSync(join(E2E_TEST_FOLDER, '.context', 'rules')), '.context/rules debería existir');
      assert.ok(existsSync(join(E2E_TEST_FOLDER, '.context', 'skills')), '.context/skills debería existir');
      assert.ok(existsSync(join(E2E_TEST_FOLDER, '.context', 'docs')), '.context/docs debería existir');
      assert.ok(existsSync(join(E2E_TEST_FOLDER, '.context', 'mcp')), '.context/mcp debería existir');
    });

    it('debería crear archivos de template', () => {
      runCLI('init . --yes');
      
      // Verificar archivos principales
      assert.ok(existsSync(join(E2E_TEST_FOLDER, 'AGENTS.md')), 'AGENTS.md debería existir');
      assert.ok(existsSync(join(E2E_TEST_FOLDER, '.context', 'architecture.md')), 'architecture.md debería existir');
    });

    it('debería NO crear archivos puente en modo --yes (quick start)', () => {
      runCLI('init . --yes');
      
      // Con --yes (non-interactive), usa quick start por defecto
      // Quick start NO genera bridges, solo .context/ + AGENTS.md
      assert.ok(!existsSync(join(E2E_TEST_FOLDER, '.cursorrules')), '.cursorrules NO debería existir en quick start');
      assert.ok(!existsSync(join(E2E_TEST_FOLDER, '.antigravityrules')), '.antigravityrules NO debería existir');
      
      // AGENTS.md sí debe existir
      assert.ok(existsSync(join(E2E_TEST_FOLDER, 'AGENTS.md')), 'AGENTS.md debería existir');
      // AGENTS.md sí debe existir
      assert.ok(existsSync(join(E2E_TEST_FOLDER, 'AGENTS.md')), 'AGENTS.md debería existir');
    });

    it('debería generar AI_BOOTSTRAP.md en modo quick start (--yes)', () => {
      runCLI('init . --yes');
      
      // En quick start (default), should generate AI_BOOTSTRAP.md
      assert.ok(existsSync(join(E2E_TEST_FOLDER, 'AI_BOOTSTRAP.md')), 'AI_BOOTSTRAP.md debería existir en quick start');
    });

    it('debería simular sin crear archivos con --dry-run', () => {
      const result = runCLI('init . --yes --dry-run');
      
      assert.ok(result.success, 'El comando debería completarse');
      assert.ok(!existsSync(join(E2E_TEST_FOLDER, '.context')), 'NO debería crear .context en dry-run');
      assert.ok(result.output.includes('DRY-RUN') || result.output.includes('simulación'), 'Debería mencionar dry-run');
    });

    it('debería respetar archivos existentes sin --force', () => {
      // Crear archivo existente
      mkdirSync(join(E2E_TEST_FOLDER, '.context'), { recursive: true });
      writeFileSync(join(E2E_TEST_FOLDER, 'AGENTS.md'), '# Original Content');
      
      runCLI('init . --yes');
      
      const content = readFileSync(join(E2E_TEST_FOLDER, 'AGENTS.md'), 'utf-8');
      assert.equal(content, '# Original Content', 'El contenido original no debería cambiar sin --force');
    });

    it('debería sobrescribir archivos con --force', () => {
      // Crear archivo existente
      mkdirSync(join(E2E_TEST_FOLDER, '.context'), { recursive: true });
      writeFileSync(join(E2E_TEST_FOLDER, 'AGENTS.md'), '# Original Content');
      
      runCLI('init . --yes --force');
      
      const content = readFileSync(join(E2E_TEST_FOLDER, 'AGENTS.md'), 'utf-8');
      assert.notEqual(content, '# Original Content', 'El contenido debería cambiar con --force');
      
      // Debería haber creado backup
      assert.ok(existsSync(join(E2E_TEST_FOLDER, 'AGENTS.md.bak')), 'Debería crear backup');
    });
  });

  describe('doctor command', () => {
    beforeEach(() => {
      cleanTestFolder();
    });

    it('debería reportar problemas en proyecto sin inicializar', () => {
      const result = runCLI('doctor .');
      
      // Debería ejecutarse y mostrar algún diagnóstico
      // El output puede variar pero el comando debería completarse
      assert.ok(result.output.length > 0, 'Debería generar output de diagnóstico');
    });

    it('debería reportar todo OK después de init', () => {
      // Primero inicializar
      runCLI('init . --yes');
      
      // Luego verificar
      const result = runCLI('doctor .');
      
      assert.ok(result.success, 'El comando debería completarse');
      // Puede reportar bridges faltantes pero la estructura debería estar OK
    });

    it('debería reparar problemas con --fix', () => {
      // Crear estructura incompleta
      mkdirSync(join(E2E_TEST_FOLDER, '.context'), { recursive: true });
      
      // Ejecutar doctor con --fix
      runCLI('doctor . --fix');
      
      // Verificar que se crearon subdirectorios
      assert.ok(existsSync(join(E2E_TEST_FOLDER, '.context', 'rules')), 'rules debería crearse con --fix');
      assert.ok(existsSync(join(E2E_TEST_FOLDER, '.context', 'skills')), 'skills debería crearse con --fix');
    });
  });

  describe('update command', () => {
    beforeEach(() => {
      cleanTestFolder();
      // Inicializar primero
      runCLI('init . --yes');
    });

    it('debería regenerar archivos puente con --yes', () => {
      // Ejecutar update con --yes genera todos los bridges
      runCLI('update . --yes');
      
      // Verificar que se generaron los bridges modernos
      assert.ok(existsSync(join(E2E_TEST_FOLDER, '.cursor', 'rules', 'global.md')), 
        'Cursor modern bridge debería existir');
      assert.ok(existsSync(join(E2E_TEST_FOLDER, 'CLAUDE.md')), 
        'CLAUDE.md debería existir');
    });

    it('debería crear directorio si es necesario', () => {
      // Ejecutar update
      runCLI('update . --yes');
      
      // Verificar que se creó el directorio .cursor/rules
      assert.ok(existsSync(join(E2E_TEST_FOLDER, '.cursor', 'rules')), 
        '.cursor/rules debería existir');
    });
  });

  describe('clean command', () => {
    beforeEach(() => {
      cleanTestFolder();
    });

    it('debería detectar carpetas de editores redundantes', () => {
      // Crear carpeta de editor con skills
      mkdirSync(join(E2E_TEST_FOLDER, '.cursor', 'skills'), { recursive: true });
      writeFileSync(join(E2E_TEST_FOLDER, '.cursor', 'skills', 'test.md'), '# Test');
      
      // Ejecutar clean en dry-run
      const result = runCLI('clean . --dry-run');
      
      assert.ok(result.output.includes('.cursor') || result.output.includes('redundante'),
        'Debería detectar .cursor como redundante');
    });

    it('debería eliminar carpetas redundantes con --yes', () => {
      // Crear carpeta de editor redundante
      mkdirSync(join(E2E_TEST_FOLDER, '.cursor', 'skills'), { recursive: true });
      writeFileSync(join(E2E_TEST_FOLDER, '.cursor', 'skills', 'test.md'), '# Test');
      
      // Ejecutar clean con confirmación automática
      runCLI('clean . --yes');
      
      // Verificar que se eliminó
      assert.ok(!existsSync(join(E2E_TEST_FOLDER, '.cursor')), '.cursor debería eliminarse');
    });

    it('debería preservar .context y .git (whitelist)', () => {
      // Crear carpetas en whitelist
      mkdirSync(join(E2E_TEST_FOLDER, '.context', 'skills'), { recursive: true });
      mkdirSync(join(E2E_TEST_FOLDER, '.git', 'hooks'), { recursive: true });
      
      // Ejecutar clean
      runCLI('clean . --yes');
      
      // Verificar que NO se eliminaron
      assert.ok(existsSync(join(E2E_TEST_FOLDER, '.context')), '.context NO debería eliminarse');
      assert.ok(existsSync(join(E2E_TEST_FOLDER, '.git')), '.git NO debería eliminarse');
    });

    it('debería reportar "todo limpio" si no hay redundantes', () => {
      // Solo crear .context (whitelist)
      mkdirSync(join(E2E_TEST_FOLDER, '.context', 'skills'), { recursive: true });
      
      const result = runCLI('clean . --yes');
      
      // El comando debería completarse sin errores y no eliminar nada
      assert.ok(result.success, 'El comando debería completarse exitosamente');
      assert.ok(existsSync(join(E2E_TEST_FOLDER, '.context')), '.context debería permanecer');
    });
  });

  describe('centralize command', () => {
    beforeEach(() => {
      cleanTestFolder();
      // Crear estructura .context
      mkdirSync(join(E2E_TEST_FOLDER, '.context', 'skills'), { recursive: true });
    });

    it('debería detectar skills dispersas en carpetas de editores', () => {
      // Crear skill dispersa en .cursor
      mkdirSync(join(E2E_TEST_FOLDER, '.cursor', 'skills', 'my-skill'), { recursive: true });
      writeFileSync(join(E2E_TEST_FOLDER, '.cursor', 'skills', 'my-skill', 'SKILL.md'), '# My Skill');
      
      // Ejecutar centralize en dry-run
      const result = runCLI('centralize . --dry-run');
      
      assert.ok(result.output.includes('.cursor') || result.output.includes('skill') || result.output.includes('Movería'),
        'Debería detectar skills dispersas');
    });

    it('debería mover skills a .context/skills/', () => {
      // Crear skill dispersa
      const skillSourceDir = join(E2E_TEST_FOLDER, '.cursor', 'skills', 'test-skill');
      mkdirSync(skillSourceDir, { recursive: true });
      writeFileSync(join(skillSourceDir, 'SKILL.md'), '# Test Skill Content');
      
      // Ejecutar centralize
      runCLI('centralize .');
      
      // Verificar que se movió
      const destFile = join(E2E_TEST_FOLDER, '.context', 'skills', 'test-skill', 'SKILL.md');
      assert.ok(existsSync(destFile), 'El skill debería moverse a .context/skills/');
      
      const content = readFileSync(destFile, 'utf-8');
      assert.equal(content, '# Test Skill Content', 'El contenido debería preservarse');
      
      // Verificar que el original se eliminó
      assert.ok(!existsSync(skillSourceDir), 'El skill original debería eliminarse');
    });

    it('debería limpiar carpetas de editores vacías después de mover', () => {
      // Crear skill dispersa
      mkdirSync(join(E2E_TEST_FOLDER, '.windsurf', 'skills', 'only-skill'), { recursive: true });
      writeFileSync(join(E2E_TEST_FOLDER, '.windsurf', 'skills', 'only-skill', 'index.md'), '# Only');
      
      // Ejecutar centralize
      runCLI('centralize .');
      
      // Verificar que .windsurf se eliminó (quedó vacía)
      assert.ok(!existsSync(join(E2E_TEST_FOLDER, '.windsurf')), 
        'La carpeta del editor debería eliminarse si queda vacía');
    });

    it('debería reportar "sin skills dispersas" si no hay nada que mover', () => {
      const result = runCLI('centralize .');
      
      // El comando debería completarse sin errores
      assert.ok(result.success, 'El comando debería completarse exitosamente');
    });
  });
});
