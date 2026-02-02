---
name: managing-agents
description: Configurar y actualizar el archivo AGENTS.md de contexto para agentes AI. Usar cuando se configura contexto de agente o se modifican instrucciones.
---

# Gestionando Contexto de Agentes

Configurar el archivo AGENTS.md que orienta a los agentes AI en tu proyecto.

## Cuándo usar

- Configurar contexto de agente AI para un nuevo proyecto
- Actualizar instrucciones de agente
- Añadir nuevas fuentes de conocimiento para agentes
- Cambiar cómo deben comportarse los agentes en tu proyecto

## Propósito de AGENTS.md

El archivo AGENTS.md es el punto de entrada para agentes AI. Les dice:
- Qué hace el proyecto
- Dónde encontrar información crítica
- Cómo comportarse y qué reglas seguir

## Plantilla Estándar

```markdown
# Contexto de Agente AI

Eres un desarrollador senior uniéndote a este proyecto.
Tu objetivo es ayudar a construir, refactorizar y mantener código siguiendo nuestra arquitectura.

## Índice de Conocimiento

Antes de escribir código, carga contexto de:

- **Arquitectura:** `.context/architecture.md`
- **Reglas:** `.context/rules/coding-standards.md`
- **Skills:** `.context/skills/`

## Estado Actual

Consulta `.context/project_state.md` para el estado actual del trabajo.
```

## Mejores prácticas

### ✅ Hacer

- Mantener AGENTS.md conciso (menos de 50 líneas)
- Apuntar a archivos detallados en vez de duplicar contenido
- Actualizar cuando cambia la estructura del proyecto
- Incluir ruta a reglas y convenciones

### ❌ Evitar

- Poner documentación detallada en AGENTS.md
- Rutas de archivo desactualizadas
- Instrucciones genéricas sin especificidad del proyecto
- Información conflictiva entre archivos

## Ubicación

AGENTS.md debe estar en la raíz del proyecto:

```
proyecto/
├── AGENTS.md           # Punto de entrada para agentes AI
├── .context/           # Contexto detallado
│   ├── architecture.md
│   ├── project_state.md
│   ├── rules/
│   └── skills/
└── src/
```
