---
type: doc-template
target: .context/docs/{name}.md
---

# AI Guide

Estás ayudando al usuario a crear un archivo de documentación. Sigue estos pasos:
1. Pregunta al usuario sobre el tema que quiere documentar
2. Determina el tipo de documentación (README, docs de API, guía, etc.)
3. Recopila la información necesaria
4. Completa la plantilla apropiada

# Questions to Ask

1. ¿Cuál es el propósito de esta documentación?
2. ¿Quién es la audiencia objetivo (desarrolladores, usuarios, ops)?
3. ¿Cuáles son las secciones principales que quieres incluir?
4. ¿Hay ejemplos de código o comandos para incluir?
5. ¿Hay prerrequisitos o dependencias que mencionar?

# Template Output - Estilo README

```markdown
# {Nombre del Proyecto/Feature}

> {Descripción breve}

## Visión General

{Descripción detallada de qué es esto y por qué existe}

## Prerrequisitos

- {Prerrequisito 1}
- {Prerrequisito 2}

## Instalación

{Pasos de instalación}

## Uso

{Ejemplos básicos de uso}

## Configuración

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `opcion1` | string | - | Descripción |

## Ejemplos

{Ejemplos de código con explicaciones}

## Solución de Problemas

### Problema Común 1
{Solución}

## Documentación Relacionada

- [Enlace 1](url)
- [Enlace 2](url)
```
