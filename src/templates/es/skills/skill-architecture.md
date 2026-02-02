---
name: documenting-architecture
description: Documentar arquitectura de proyecto, tech stack y flujo de datos. Usar cuando se configura o actualiza documentación de arquitectura.
---

# Documentando Arquitectura

Crear y mantener documentación de arquitectura para agentes AI y desarrolladores.

## Cuándo usar

- Iniciar un nuevo proyecto
- Cambios importantes en tech stack
- Añadir nuevos servicios o integraciones
- Onboarding de nuevos miembros o agentes AI

## Estructura del Documento de Arquitectura

```markdown
# Arquitectura del Proyecto

## Objetivo del Proyecto
[2-3 líneas describiendo el propósito de la aplicación]

## Tech Stack

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React      | 18.x    | UI        |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js    | 20.x    | API       |

## Estructura de Directorios
[Árbol mostrando directorios clave]

## Flujo de Datos
[Diagrama o descripción de cómo fluyen los datos]

## Variables de Entorno
| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| API_KEY  | Clave de servicio | ✅  |
```

## Secciones Clave

1. **Tech Stack**: Todas las tecnologías con versiones
2. **Estructura de Directorios**: Carpetas clave y su propósito
3. **Flujo de Datos**: Cómo se mueven los datos por el sistema
4. **Variables de Entorno**: Configuración requerida
5. **Dependencias Críticas**: Paquetes importantes

## Triggers de Actualización

Actualizar architecture.md cuando:
- Se añaden nuevos frameworks o librerías
- Cambia la estructura de directorios
- Se añaden nuevos servicios o APIs
- Se modifica el flujo de datos

## Mejores prácticas

### ✅ Hacer

- Incluir versiones específicas
- Documentar el POR QUÉ no solo el QUÉ
- Mantener actualizado con el codebase
- Usar tablas para escaneo rápido

### ❌ Evitar

- Números de versión desactualizados
- Integraciones críticas faltantes
- Demasiado detalle (enlazar a docs)
- Detalles de implementación (poner en comentarios de código)

## Ubicación del Archivo

```
proyecto/
└── .context/
    └── architecture.md  # Documento principal de arquitectura
```
