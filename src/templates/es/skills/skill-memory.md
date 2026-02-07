---
name: managing-memory
description: Mantiene los archivos del Memory Bank en .context/memory/. Usar al actualizar el estado del proyecto, seguir el progreso o persistir contexto entre sesiones.
---

# Gestión del Memory Bank

Mantén los archivos del Memory Bank actualizados para mantener el contexto entre sesiones de IA.

## Cuándo usar

- Al iniciar una nueva sesión de desarrollo (leer archivos primero)
- Al completar una tarea significativa (actualizar progreso)
- Al cambiar el foco del proyecto (actualizar contexto activo)
- Decisiones arquitectónicas importantes (actualizar contexto técnico)

## Estructura del Memory Bank

```
.context/memory/
├── project_brief.md    # Visión y objetivos (cambia raramente)
├── tech_context.md     # Stack y patrones (actualiza con cambios técnicos)
├── active_context.md   # Foco actual (actualiza frecuentemente)
└── progress.md         # Hitos y changelog (actualiza por tarea)
```

## Frecuencia de Actualización

| Archivo | Frecuencia | Disparador |
|---------|------------|------------|
| `project_brief.md` | Rara vez | Cambios de objetivos importantes |
| `tech_context.md` | Ocasionalmente | Nueva tecnología, patrones |
| `active_context.md` | Cada sesión | Cambios de foco |
| `progress.md` | Por tarea | Completar tarea |

## Guías de Actualización

### active_context.md

Actualizar al INICIO y FIN de cada sesión:

```markdown
## Foco Actual
[En qué estás trabajando AHORA]

## Cambios Recientes
- [Más reciente primero]

## Próximos Pasos
1. [ ] Próxima acción inmediata
```

### progress.md

Actualizar al completar trabajo significativo:

```markdown
### [FECHA]
- Añadido: [nuevas características]
- Cambiado: [modificaciones]
- Arreglado: [correcciones de bugs]
```

### tech_context.md

Actualizar al añadir nuevas dependencias o patrones:

```markdown
## Stack
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| [Nueva tech] | [ver] | [por qué] |
```

## Mejores Prácticas

### ✅ Hacer

- Leer TODOS los archivos de memoria al inicio de la sesión
- Actualizar `active_context.md` antes de terminar el trabajo
- Mantener las entradas concisas y escaneables
- Usar tablas para datos estructurados
- Incluir fechas en las entradas de progreso

### ❌ Evitar

- Duplicar información entre archivos
- Dejar "Foco Actual" desactualizado
- Olvidar actualizar el progreso después de completar tareas
- Escribir párrafos en lugar de viñetas

## Flujo de Trabajo por Sesión

1. **Inicio**: Leer todos los archivos de memoria para contexto
2. **Trabajo**: Enfocarse en la tarea actual
3. **Completar**: Actualizar progress.md con los cambios
4. **Fin**: Actualizar active_context.md con próximos pasos
