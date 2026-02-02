/**
 * Tests para el módulo templates
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'fs';

import { 
  getTemplatePath,
  readTemplate,
  TEMPLATE_MAPPINGS,
  BASE_SKILLS,
  OPTIONAL_SKILLS
} from '../dist/lib/templates.js';

describe('templates', () => {
  describe('getTemplatePath', () => {
    it('debería retornar ruta absoluta con idioma', () => {
      const path = getTemplatePath('base/_agents.md');
      assert.ok(path.includes('templates'));
      assert.ok(path.includes('/en/') || path.includes('/es/'));
      assert.ok(path.endsWith('_agents.md'));
    });
  });

  describe('readTemplate', () => {
    it('debería leer el contenido de _agents.md (EN por defecto)', () => {
      const content = readTemplate('base/_agents.md');
      assert.ok(content.length > 0);
      // Default is now English
      assert.ok(content.includes('AI Agent') || content.includes('context') || content.includes('AGENTS'));
    });

    it('debería leer el contenido de _architecture.md (EN por defecto)', () => {
      const content = readTemplate('base/_architecture.md');
      // Default is now English
      assert.ok(content.includes('Architecture') || content.includes('Project') || content.includes('architecture'));
    });
  });

  describe('TEMPLATE_MAPPINGS', () => {
    it('debería tener 6 templates definidos', () => {
      const keys = Object.keys(TEMPLATE_MAPPINGS);
      assert.equal(keys.length, 6);
    });

    it('base/_agents.md debería ir a la raíz', () => {
      const mapping = TEMPLATE_MAPPINGS['base/_agents.md'];
      assert.equal(mapping.isRoot, true);
      assert.equal(mapping.dest, 'AGENTS.md');
    });


    it('todos los templates deben existir', () => {
      for (const name of Object.keys(TEMPLATE_MAPPINGS)) {
        const path = getTemplatePath(name);
        assert.ok(existsSync(path), `Template ${name} debe existir`);
      }
    });

    it('los destinos deben seguir patrón correcto', () => {
      for (const [name, config] of Object.entries(TEMPLATE_MAPPINGS)) {
        if (!config.isRoot) {
          assert.ok(
            config.dest.startsWith('.context/'),
            `${name} debe ir a .context/`
          );
        }
      }
    });
  });

  describe('BASE_SKILLS', () => {
    it('debería tener 5 skills base definidos', () => {
      const keys = Object.keys(BASE_SKILLS);
      assert.equal(keys.length, 5);
    });

    it('todos los skills base deben existir', () => {
      for (const name of Object.keys(BASE_SKILLS)) {
        const path = getTemplatePath(name);
        assert.ok(existsSync(path), `Skill ${name} debe existir`);
      }
    });

    it('los skills base deben usar estructura de carpetas con SKILL.md', () => {
      for (const [name, config] of Object.entries(BASE_SKILLS)) {
        assert.ok(
          config.dest.endsWith('/SKILL.md'),
          `${name} debe terminar en /SKILL.md`
        );
      }
    });

    it('todos los skills base deben tener YAML frontmatter', () => {
      const yamlFrontmatterRegex = /^---\s*\nname:\s*.+\ndescription:\s*.+\n---/;
      
      for (const name of Object.keys(BASE_SKILLS)) {
        const path = getTemplatePath(name);
        const content = readFileSync(path, 'utf-8');
        assert.ok(
          yamlFrontmatterRegex.test(content),
          `Skill ${name} debe tener YAML frontmatter con name y description`
        );
      }
    });
  });

  describe('OPTIONAL_SKILLS', () => {
    it('debería tener 4 skills opcionales definidos', () => {
      const keys = Object.keys(OPTIONAL_SKILLS);
      assert.equal(keys.length, 4);
    });

    it('todos los skills opcionales deben existir', () => {
      for (const name of Object.keys(OPTIONAL_SKILLS)) {
        const path = getTemplatePath(name);
        assert.ok(existsSync(path), `Skill ${name} debe existir`);
      }
    });

    it('los skills opcionales deben usar estructura de carpetas con SKILL.md', () => {
      for (const [name, config] of Object.entries(OPTIONAL_SKILLS)) {
        assert.ok(
          config.dest.endsWith('/SKILL.md'),
          `${name} debe terminar en /SKILL.md`
        );
      }
    });

    it('todos los skills opcionales deben tener YAML frontmatter', () => {
      const yamlFrontmatterRegex = /^---\s*\nname:\s*.+\ndescription:\s*.+\n---/;
      
      for (const name of Object.keys(OPTIONAL_SKILLS)) {
        const path = getTemplatePath(name);
        const content = readFileSync(path, 'utf-8');
        assert.ok(
          yamlFrontmatterRegex.test(content),
          `Skill ${name} debe tener YAML frontmatter con name y description`
        );
      }
    });
  });
});

