---
name: tracking-project-state
description: Gestionar documentación de estado del proyecto para contexto de agentes AI. Usar cuando se actualiza estado de trabajo, prioridades o fase del proyecto.
---

# Seguimiento del Estado del Proyecto

Mantener un documento vivo del estado actual del proyecto para agentes AI.

## Cuándo usar

- Iniciar o completar tareas importantes
- Cambiar prioridades del proyecto
- Surgen bloqueos
- Transiciones de sprint o fase

## Estructura del Estado del Proyecto

```markdown
# Estado del Proyecto

## Fase Actual
[Desarrollo / Testing / Mantenimiento / etc.]

## Trabajo Activo

### En Progreso
- [ ] Feature X - [estado breve]
- [ ] Bug fix Y - [estado breve]

### Bloqueado
- Issue Z - [razón] - [responsable]

## Completados Recientes
- ✅ Feature A (fecha)
- ✅ Bug fix B (fecha)

## Próximas Prioridades
1. Tarea prioritaria 1
2. Tarea prioritaria 2

## Issues Conocidos
- Descripción del issue - [severidad]
```

## Frecuencia de Actualización

Actualizar project_state.md cuando:
- Se inicia trabajo significativo
- Se completan features o fixes
- Se encuentran bloqueos
- Cambian prioridades
- Comienza nuevo sprint/fase

## Mejores prácticas

### ✅ Hacer

- Mantenerlo actual (actualizar mismo día)
- Ser específico sobre el estado
- Incluir bloqueos y responsables
- Fechar completados recientes
- Limitar a prioridades principales

### ❌ Evitar

- Información desactualizada (>1 semana)
- Demasiado detalle (enlazar a issues)
- Log histórico (mantener solo reciente)
- Actualizaciones de estado vagas

## Integración con Agentes AI

Los agentes AI consultan project_state.md para:
- Entender en qué se está trabajando
- Evitar cambios conflictivos
- Priorizar sus sugerencias
- Proporcionar ayuda contextual

## Ubicación del Archivo

```
proyecto/
└── .context/
    └── project_state.md  # Estado actual del proyecto
```

## Plantilla de Actualización Rápida

Al actualizar, usa este formato:

```markdown
## Actualización [Fecha]

**Completado**: [qué se terminó]
**En Progreso**: [en qué se está trabajando]
**Siguiente**: [próxima prioridad]
**Bloqueado**: [bloqueos] (si aplica)
```
