---
name: managing-agents
description: Configurar y sincronizar AGENTS.md con los archivos de .context/. Usar al configurar contexto de agente, modificar instrucciones, o después de cambios en rules/skills.
---

# Gestionando Contexto de Agentes

Configurar el archivo AGENTS.md que orienta a los agentes AI en tu proyecto.

## Cuándo usar

- Configurar contexto de agente AI para un nuevo proyecto
- Después de añadir nuevas reglas a `.context/rules/`
- Después de añadir nuevas skills a `.context/skills/`
- Después de actualizar arquitectura o estado del proyecto
- Cambiar cómo deben comportarse los agentes en tu proyecto

## Propósito de AGENTS.md

El archivo AGENTS.md es el **punto de entrada universal** para TODOS los agentes AI:
- Cursor, Copilot, Claude, Gemini, Windsurf todos leen este archivo
- Proporciona una única fuente de verdad para el contexto del proyecto
- Indexa todo el contenido de `.context/`

## Disparador de Auto-Sync

**Después de modificar cualquier archivo en `.context/`**, verifica si AGENTS.md necesita actualización:

1. Escanear `.context/rules/` para todos los archivos `.md`
2. Escanear `.context/skills/` para todos los archivos `SKILL.md`
3. Actualizar la sección de Índice de Conocimiento si hay cambios
4. Mantener AGENTS.md bajo 50 líneas

## Plantilla Estándar

```markdown
# Contexto de Agente AI

Eres un desarrollador senior uniéndote a este proyecto.
Tu objetivo es ayudar a construir, refactorizar y mantener código siguiendo nuestra arquitectura.

## Índice de Conocimiento

| Área | Ruta | Descripción |
|------|------|-------------|
| Arquitectura | `.context/architecture.md` | Estructura del proyecto |
| Reglas | `.context/rules/` | Estándares de código |
| Skills | `.context/skills/` | Instrucciones reutilizables |
| Estado | `.context/project_state.md` | Trabajo actual |
| Memoria | `.context/memory/` | Persistencia de sesión |

## Reglas Activas

- [coding-standards](.context/rules/coding-standards.md)

## Skills Disponibles

- [generating-skills](.context/skills/generating-skills/SKILL.md)
- [managing-agents](.context/skills/managing-agents/SKILL.md)
...

## Principios

- Seguir todas las reglas en `.context/rules/`
- Revisar estado del proyecto antes de empezar
- Actualizar memory bank al finalizar sesión
```

## Mejores prácticas

### ✅ Hacer

- Mantener AGENTS.md conciso (menos de 50 líneas)
- Apuntar a archivos detallados en vez de duplicar contenido
- Actualizar cuando cambia la estructura de `.context/`
- Incluir tabla de contenidos hacia todas las áreas de contexto

### ❌ Evitar

- Poner documentación detallada en AGENTS.md
- Rutas de archivo desactualizadas
- Instrucciones genéricas sin especificidad del proyecto
- Olvidar listar nuevas reglas o skills

## Ubicación

AGENTS.md debe estar en la raíz del proyecto:

```
proyecto/
├── AGENTS.md           # Punto de entrada (hub universal)
├── .context/           # Contexto detallado
│   ├── architecture.md
│   ├── project_state.md
│   ├── rules/
│   ├── skills/
│   └── memory/
└── src/
```
