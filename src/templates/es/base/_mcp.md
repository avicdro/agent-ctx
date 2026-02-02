---
type: mcp-template
target: .context/mcp/{name}.md
---

# AI Guide

Estás ayudando al usuario a documentar una configuración de servidor MCP (Model Context Protocol). Sigue estos pasos:
1. Pregunta sobre el servidor MCP que está usando o creando
2. Recopila las herramientas/recursos que proporciona
3. Documenta patrones de uso y ejemplos

# Questions to Ask

1. ¿Cuál es el nombre del servidor MCP?
2. ¿Qué capacidades proporciona (tools, resources, prompts)?
3. ¿Cómo se configura/inicializa?
4. ¿Cuáles son los comandos o herramientas principales disponibles?
5. ¿Se necesitan variables de entorno o secretos?

# Template Output

```markdown
# 🔌 Servidor MCP: {nombre}

> {Descripción breve de lo que hace este servidor}

## Visión General

{Qué proporciona este servidor MCP y por qué es útil}

## Instalación

{Cómo instalar o habilitar este servidor}

## Configuración

```json
{
  "mcpServers": {
    "{nombre}": {
      "command": "{comando}",
      "args": ["{args}"],
      "env": {
        "VAR_NAME": "value"
      }
    }
  }
}
```

## Herramientas Disponibles

| Herramienta | Descripción | Parámetros |
|-------------|-------------|------------|
| `nombre_tool` | Qué hace | `param1`, `param2` |

## Recursos Disponibles

| Recurso | Patrón URI | Descripción |
|---------|------------|-------------|
| `nombre_recurso` | `protocol://path` | Qué proporciona |

## Ejemplos de Uso

### Ejemplo 1: {Descripción}
{Cómo usar una herramienta o recurso específico}

### Ejemplo 2: {Descripción}
{Otro ejemplo de uso}

## Mejores Prácticas

- {Mejor práctica 1}
- {Mejor práctica 2}

## Solución de Problemas

### {Problema Común}
{Solución}
```
