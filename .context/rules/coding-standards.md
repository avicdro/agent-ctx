# Coding Standards and Rules

## 1. General Principles

- **DRY (Don't Repeat Yourself):** Extract repeated logic to shared utilities in `src/lib/`.
- **KISS (Keep It Simple, Stupid):** Prefer the most readable solution over the "clever" one.
- **Single Responsibility:** Each command file handles one CLI command, utilities are focused.
- **Composition:** Build features by composing smaller, tested functions.

## 2. TypeScript & Typing

- **Forbidden:** Using `any`. If you don't know the type, use `unknown` and do narrowing.
- **Required:** Define interfaces/types for all function parameters and return types.
- **Preference:** Use `type` for object definitions and `interface` if you need to extend them.
- **Strict Mode:** `tsconfig.json` has `strict: true` enabled.
- **Target:** ES2022 with NodeNext module resolution.

## 3. Module System

- **ESM Only:** Project uses ES Modules (`"type": "module"` in package.json).
- **Imports:** Always include `.js` extension in imports (e.g., `'./lib/utils.js'`).
- **Node APIs:** Use `import` from `'fs'`, `'path'`, etc.

## 4. Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files (commands) | `camelCase.ts` | `init.ts`, `doctor.ts` |
| Files (utilities) | `camelCase.ts` | `bridges.ts`, `i18n.ts` |
| Interfaces | `PascalCase` | `BridgeConfig`, `InitOptions` |
| Functions | `camelCase` | `getCursorGlobalRules()`, `initCommand()` |
| Variables | `camelCase` | `targetDir`, `bridgeFiles` |
| Constants | `UPPER_SNAKE_CASE` | `BRIDGE_FILES`, `VERSION` |
| CLI Commands | `kebab-case` | `agent-ctx init`, `agent-ctx add` |

## 5. Code Style

- **Indentation:** 2 spaces (enforced by ESLint and editor config)
- **Quotes:** Single quotes for strings
- **Semicolons:** Yes, always
- **Line Length:** Preferably under 100 characters
- **Trailing Commas:** Yes, in multiline constructs

## 6. Error Handling

- Wrap async calls in `try/catch` blocks.
- Use the `logger` module for consistent error output.
- Show user-friendly messages, not raw stack traces.
- Use `failSpinner()` to indicate failed operations.
- Never leave a `catch` empty. Log the error or rethrow.

## 7. Internationalization (i18n)

- All user-facing strings should use the `t()` function from `src/lib/i18n.ts`.
- Add translations in both `en` and `es` locales.
- Template files are stored separately in `src/templates/en/` and `src/templates/es/`.

## 8. Logging & User Feedback

- Use `logger` from `src/lib/logger.ts` for consistent output.
- Use spinners (`startSpinner`, `succeedSpinner`, `failSpinner`) for async operations.
- Support `--quiet` mode via `setQuietMode()`.
- Use chalk for colored output (success = green, error = red, info = blue).

## 9. Testing

- Test files are in `__tests__/` directory with `.test.js` extension.
- Run tests with `npm test` (which builds first, then runs Node's native test runner).
- Tests should be self-contained and not depend on external state.
- Use descriptive test names that explain the expected behavior.

## 10. File System Operations

- Always use absolute paths when interacting with the file system.
- Use `ensureDir()` from utils before writing files.
- Check `existsSync()` before operations that might fail.
- Respect `--dry-run` and `--force` flags consistently.

## 11. Command Structure

Every command should:
1. Accept a `directory` parameter (default: current directory)
2. Support common options: `--yes`, `--force`, `--dry-run` where applicable
3. Resolve `directory` to absolute path using `resolvePath()`
4. Provide clear, actionable feedback to the user
5. Return gracefully on user cancellation
