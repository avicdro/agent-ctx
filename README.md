# agentrc 🤖

> CLI para inicializar y gestionar contexto de agentes AI en tus proyectos

[![npm version](https://badge.fury.io/js/agentrc.svg)](https://www.npmjs.com/package/agentrc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ¿Qué es agentrc?

**agentrc** es una herramienta CLI que configura una estructura de contexto estandarizada (`.context/`) para que cualquier agente AI (Cursor, Windsurf, Claude, Copilot, Cline, etc.) entienda tu proyecto de forma consistente.

### ¿Por qué lo necesitas?

- 🪟 **Compatible con Windows, Mac y Linux** - Sin dependencia de bash
- 📦 **Fácil de distribuir** - `npx agentrc init` y listo
- 🔄 **Centralización** - Una sola fuente de verdad para todos los agentes
- 🏥 **Auto-reparación** - Detecta y arregla archivos rotos
- 📚 **Skills reutilizables** - Estructura modular para compartir conocimiento

## Instalación

```bash
# Uso directo con npx (recomendado)
npx agentrc init

# O instalación global
npm install -g agentrc
```

## Comandos

### `agentrc init`

Inicializa la estructura `.context/` y genera archivos puente para diferentes editores.

```bash
npx agentrc init                    # Directorio actual
npx agentrc init ./mi-proyecto      # Directorio específico
npx agentrc init --yes              # Modo no interactivo
npx agentrc init --force            # Sobrescribe existentes
npx agentrc init --dry-run          # Solo muestra qué haría
```


### `agentrc update`

Regenera los archivos puente con las últimas plantillas sin tocar `.context/`.

```bash
npx agentrc update                  # Interactivo
npx agentrc update --yes            # Actualiza todos
```

### `agentrc centralize`

Busca skills dispersas en carpetas de editores (`.cursor/skills`, `.windsurf/skills`, etc.) y las mueve a `.context/skills/`.

```bash
npx agentrc centralize
npx agentrc centralize --dry-run
```

### `agentrc clean`

Elimina carpetas redundantes de editores que duplican skills/rules.

```bash
npx agentrc clean
npx agentrc clean --yes             # Sin confirmación
npx agentrc clean --dry-run
```

### `agentrc doctor`

Verifica la integridad de `.context/` y archivos puente, ofrece reparaciones.

```bash
npx agentrc doctor                  # Solo diagnóstico
npx agentrc doctor --fix            # Repara automáticamente
```

## Flags globales

| Flag | Descripción |
|------|-------------|
| `-q, --quiet` | Suprime output no esencial |
| `-v, --version` | Muestra versión |
| `-h, --help` | Muestra ayuda |

## Configuración por proyecto

Crea un archivo `.agentrc.json` en la raíz del proyecto:

```json
{
  "editors": ["cursor", "claude", "copilot"],
  "language": "es",
  "backups": true
}
```

## Estructura generada

```
tu-proyecto/
├── .context/
│   ├── architecture.md       # Stack y estructura del proyecto
│   ├── project_state.md      # Estado actual, TODOs, bugs
│   ├── rules/
│   │   └── coding-standards.md
│   ├── skills/
│   │   └── _template_skill.md
│   ├── docs/
│   │   └── README.md
│   └── mcp/
│       └── README.md
├── AGENTS.md                 # Índice maestro para agentes
├── CLAUDE.md                 # Instrucciones para Claude
├── .cursorrules              # Puente para Cursor
├── .windsurfrules            # Puente para Windsurf
├── .clinerules               # Puente para Cline
├── .roomodes                 # Puente para Roo
└── .github/
    └── copilot-instructions.md  # Puente para GitHub Copilot
```

## Contribuir

¿Encontraste un bug o tienes una idea? ¡Abre un issue o PR!

## License

MIT © avicdro
