# Estándares de Código y Reglas

## 1. Principios Generales
- **DRY (Don't Repeat Yourself):** Extrae lógica repetida a hooks o utilidades.
- **KISS (Keep It Simple, Stupid):** Prefiere la solución más legible a la más "inteligente".
- **Composición:** Prefiere componentes pequeños y compuestos sobre monolitos.

## 2. TypeScript & Tipado
- **Prohibido:** Usar `any`. Si no sabes el tipo, usa `unknown` y haz narrowing.
- **Requerido:** Definir interfaces/tipos para todas las Props de componentes.
- **Preferencia:** Usa `type` para definiciones de objetos y `interface` si necesitas extenderlas.

## 3. Estilos y Naming
- **Componentes:** `PascalCase` (ej: `UserProfile.tsx`).
- **Funciones/Variables:** `camelCase` (ej: `getUserData`).
- **Constantes:** `UPPER_SNAKE_CASE` (ej: `MAX_RETRY_COUNT`).
- **CSS:** Usamos [Tailwind CSS]. Evita estilos en línea (`style={{...}}`).

## 4. Gestión de Errores
- Envuelve llamadas asíncronas en bloques `try/catch`.
- Usa componentes `ErrorBoundary` para fallos de UI.
- Nunca dejes un `catch` vacío. Loguea el error.
