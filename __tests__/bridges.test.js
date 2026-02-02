/**
 * Tests para el módulo bridges
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { 
  getCursorGlobalRules,
  getClaudeMd,
  getCopilotInstructions,
  getCopilotContextInstructions,
  getAntigravityRules,
  BRIDGE_FILES
} from '../dist/lib/bridges.js';

describe('bridges', () => {
  describe('generadores de contenido', () => {
    it('getCursorGlobalRules debería incluir frontmatter y AGENTS.md', () => {
      const content = getCursorGlobalRules();
      assert.ok(content.includes('---'));
      assert.ok(content.includes('AGENTS.md') || content.includes('.context'));
    });

    it('getClaudeMd debería dar instrucciones detalladas', () => {
      const content = getClaudeMd();
      // i18n-based: check for file paths instead of specific text
      assert.ok(content.includes('architecture.md'));
      assert.ok(content.includes('.context'));
    });

    it('getCopilotInstructions debería mencionar TypeScript', () => {
      const content = getCopilotInstructions();
      assert.ok(content.includes('TypeScript'));
      assert.ok(content.includes('.context'));
    });

    it('getCopilotContextInstructions debería tener frontmatter', () => {
      const content = getCopilotContextInstructions();
      assert.ok(content.includes('---'));
      assert.ok(content.includes('applyTo'));
    });

    it('getAntigravityRules debería mencionar .context y AGENTS.md', () => {
      const content = getAntigravityRules();
      assert.ok(content.includes('.context'));
      assert.ok(content.includes('AGENTS.md'));
    });
  });

  describe('BRIDGE_FILES', () => {
    it('debería tener 5 editores configurados (modernos + Antigravity)', () => {
      const keys = Object.keys(BRIDGE_FILES);
      assert.equal(keys.length, 5);
    });

    it('cada bridge debe tener name y generator', () => {
      for (const [file, config] of Object.entries(BRIDGE_FILES)) {
        assert.ok(config.name, `${file} debe tener name`);
        assert.ok(typeof config.generator === 'function', `${file} debe tener generator`);
      }
    });

    it('copilot debe requerir directorio .github', () => {
      const copilot = BRIDGE_FILES['.github/copilot-instructions.md'];
      assert.equal(copilot.needsDir, '.github');
    });
  });
});
