---
name: creating-rules
description: Definir documentación de reglas y estándares de código. Usar cuando se establecen o actualizan convenciones de código, reglas de linter o estándares de equipo.
---

# Creando Reglas de Código

Definir y documentar estándares de código que agentes AI y desarrolladores deben seguir.

## Cuándo usar

- Establecer nuevas convenciones de código
- Documentar estándares de equipo existentes
- Añadir reglas de linter o formatter
- Clarificar patrones de código ambiguos

## Estructura del Documento de Regla

```markdown
# Regla: [Nombre de la Regla]

> Descripción breve de la regla

## Por qué existe esta regla

[Explica el problema que previene o beneficio que proporciona]

## Requisitos

- Requisito 1
- Requisito 2

## ✅ Ejemplos Correctos

[Código mostrando uso correcto]

## ❌ Ejemplos Incorrectos

[Código mostrando qué evitar]

## Excepciones

[Excepciones válidas o "Sin excepciones"]

## Enforcement

- [ ] Regla de linter: [nombre de regla]
- [ ] Checklist de code review
- [ ] Test automatizado
```

## Categorías Comunes de Reglas

### Estilo de Código

- Convenciones de nombres (camelCase, PascalCase)
- Organización de archivos
- Orden de imports
- Estándares de comentarios

### Arquitectura

- Estructura de componentes
- Patrones de gestión de estado
- Patrones de diseño de API
- Manejo de errores

### Calidad

- Requisitos de cobertura de tests
- Umbrales de rendimiento
- Prácticas de seguridad
- Estándares de accesibilidad

## Escribiendo Reglas Efectivas

### ✅ Hacer

- Proporcionar ejemplos concretos
- Explicar el "por qué" no solo el "qué"
- Incluir ejemplos correctos e incorrectos
- Hacer reglas aplicables (linter, tests)

### ❌ Evitar

- Requisitos vagos
- Reglas sin ejemplos
- Reglas conflictivas
- Excepciones demasiado estrictas

## Organización de Archivos

```
.context/
└── rules/
    ├── coding-standards.md    # Estándares principales
    ├── naming-conventions.md  # Reglas de nombres
    ├── testing-rules.md       # Requisitos de tests
    └── security-rules.md      # Prácticas de seguridad
```
