---
name: generating-skills
description: Crear nuevos skills de agente siguiendo las mejores prácticas de SKILL.md. Usar cuando se crean, validan o mejoran archivos de skills para consumo de agentes AI.
---

# Generando Skills

Crear skills efectivos que los agentes AI puedan descubrir y usar.

## Cuándo usar

- Crear un nuevo skill desde cero
- Validar formato de skill existente
- Mejorar la descubribilidad de skills
- Convertir documentación a formato de skill

## Estructura de Carpetas Estándar

```
nombre-skill/
├── SKILL.md        # Requerido: instrucciones + metadata
├── scripts/        # Opcional: utilidades ejecutables
├── references/     # Opcional: documentación detallada
└── assets/         # Opcional: plantillas, recursos
```

Para skills simples, un solo archivo `SKILL.md` es suficiente.

## Requisitos de YAML Frontmatter

```yaml
---
name: nombre-skill
description: Qué hace el skill y cuándo usarlo. Tercera persona. Max 1024 chars.
---
```

### Validación de Nombre

- Máximo 64 caracteres
- Solo letras minúsculas, números, guiones
- Sin guiones consecutivos (`--`)
- No puede empezar/terminar con guión
- Patrón: `^[a-z0-9]+(-[a-z0-9]+)*$`

**Buenos nombres**: `api-design`, `git-workflow`, `processing-pdfs`
**Malos nombres**: `APIDesign`, `git--workflow`, `-api-design`

### Guías de Descripción

- Escribir en tercera persona
- Incluir QUÉ hace Y CUÁNDO usarlo
- Ser específico con términos de activación
- Máximo 1024 caracteres

**Bueno**: `Diseña APIs REST con patrones consistentes. Usar cuando se crean endpoints o manejo de errores.`
**Malo**: `Ayuda con APIs`

## Plantilla SKILL.md

```markdown
---
name: nombre-skill
description: Descripción breve en tercera persona. Incluir cuándo usar.
---

# Nombre del Skill

Breve descripción.

## Cuándo usar

- Condición de activación 1
- Condición de activación 2

## Inicio rápido

Ejemplo mínimo para empezar.

## Pasos de implementación

1. Paso 1
2. Paso 2

## Mejores prácticas

### ✅ Hacer
- Buena práctica

### ❌ Evitar
- Anti-patrón

## Referencias

- [Enlace](url)
```

## Eficiencia de Tokens

- Mantener SKILL.md bajo 500 líneas
- Dividir contenido en archivos separados para skills complejos
- Usar revelación progresiva (archivos referenciados cargados bajo demanda)
- Asumir que Claude conoce patrones comunes

## Checklist de Workflow

Copia y sigue el progreso:

```
- [ ] Nombre sigue formato lowercase-hyphen
- [ ] Descripción es específica e incluye triggers
- [ ] Sección "Cuándo usar" presente
- [ ] Ejemplo de inicio rápido incluido
- [ ] Mejores prácticas documentadas
- [ ] Menos de 500 líneas
```
