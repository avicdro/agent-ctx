# Coding Standards and Rules

## 1. General Principles
- **DRY (Don't Repeat Yourself):** Extract repeated logic to hooks or utilities.
- **KISS (Keep It Simple, Stupid):** Prefer the most readable solution over the "clever" one.
- **Composition:** Prefer small, composed components over monoliths.

## 2. TypeScript & Typing
- **Forbidden:** Using `any`. If you don't know the type, use `unknown` and do narrowing.
- **Required:** Define interfaces/types for all component Props.
- **Preference:** Use `type` for object definitions and `interface` if you need to extend them.

## 3. Styles and Naming
- **Components:** `PascalCase` (e.g., `UserProfile.tsx`).
- **Functions/Variables:** `camelCase` (e.g., `getUserData`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`).
- **CSS:** We use [Tailwind CSS]. Avoid inline styles (`style={{...}}`).

## 4. Error Handling
- Wrap async calls in `try/catch` blocks.
- Use `ErrorBoundary` components for UI failures.
- Never leave a `catch` empty. Log the error.
