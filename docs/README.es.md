# agent-ctx

> CLI para inicializar y gestionar contexto de agentes AI en tus proyectos

[![npm version](https://badge.fury.io/js/agent-ctx.svg)](https://www.npmjs.com/package/agent-ctx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Español | **[English](../README.md)**

## ¿Qué es agent-ctx?

**agent-ctx** es una herramienta CLI que configura una estructura de contexto estandarizada (`.context/`) para que cualquier agente AI (Cursor, Windsurf, Claude, Copilot, Cline, etc.) entienda tu proyecto de forma consistente.

### ¿Por qué usarla?

- **Multiplataforma** — Funciona en Windows, Mac y Linux sin depender de bash
- **Fácil de distribuir** — Solo ejecuta `npx agent-ctx init` y listo
- **Fuente única de verdad** — Contexto centralizado para todos tus agentes
- **Auto-reparación** — Detecta y repara archivos de configuración rotos
- **Skills modulares** — Estructura reutilizable para compartir conocimiento entre proyectos

## Instalación

```bash
# Uso directo con npx (recomendado)
npx agent-ctx init

# O instalación global
npm install -g agent-ctx
```

## Comandos

### `agent-ctx init`

Inicializa la estructura `.context/` y genera archivos puente para diferentes editores.

```bash
npx agent-ctx init                    # Directorio actual
npx agent-ctx init ./mi-proyecto      # Directorio específico
npx agent-ctx init --yes              # Modo no interactivo
npx agent-ctx init --force            # Sobrescribe archivos existentes
npx agent-ctx init --dry-run          # Solo muestra qué haría
```

### `agent-ctx update`

Regenera los archivos puente con las últimas plantillas sin tocar `.context/`.

```bash
npx agent-ctx update                  # Interactivo
npx agent-ctx update --yes            # Actualiza todos
```

### `agent-ctx centralize`

Busca skills dispersas en carpetas de editores (`.cursor/skills`, `.windsurf/skills`, etc.) y las mueve a `.context/skills/`.

```bash
npx agent-ctx centralize
npx agent-ctx centralize --dry-run
```

### `agent-ctx clean`

Elimina carpetas redundantes de editores que duplican skills/rules.

```bash
npx agent-ctx clean
npx agent-ctx clean --yes             # Sin confirmación
npx agent-ctx clean --dry-run
```

### `agent-ctx doctor`

Verifica la integridad de `.context/` y archivos puente, ofrece reparaciones.

```bash
npx agent-ctx doctor                  # Solo diagnóstico
npx agent-ctx doctor --fix            # Repara automáticamente
```

## Flags globales

| Flag | Descripción |
|------|-------------|
| `-q, --quiet` | Suprime output no esencial |
| `-v, --version` | Muestra versión |
| `-h, --help` | Muestra ayuda |

## Configuración por proyecto

Crea un archivo `.agent-ctx.json` en la raíz del proyecto:

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

¿Encontraste un bug o tienes una idea? Abre un issue o PR.

## Licencia

MIT © avicdro
