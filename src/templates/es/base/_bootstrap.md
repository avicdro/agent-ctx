# Prompt de Configuración IA

> **ELIMINA ESTE ARCHIVO** después de que tu agente IA haya completado la configuración.
> Este es un ayudante de configuración de una sola vez.

---

## Tu Misión

Estás ayudándome a configurar el contexto de IA para este proyecto. Tu objetivo es **analizar el código existente** y **poblar los archivos `.context/`** con información precisa.

---

## Tareas

Por favor completa las siguientes tareas en orden:

### 1. Analizar el Proyecto

Escanea el código e identifica:
- [ ] Lenguajes de programación utilizados
- [ ] Frameworks y librerías (revisa `package.json`, `requirements.txt`, `go.mod`, etc.)
- [ ] Estructura de directorios y su propósito
- [ ] Puntos de entrada y archivos principales
- [ ] Base de datos y servicios externos
- [ ] Comandos de build y test

### 2. Actualizar `.context/architecture.md`

Basándote en tu análisis, completa:
- **Objetivo del Proyecto**: ¿Qué hace esta aplicación?
- **Stack Tecnológico**: Completa las tablas con las tecnologías reales
- **Estructura de Directorios**: Reemplaza el ejemplo con la estructura real
- **Flujo de Datos**: ¿Cómo fluyen las peticiones por el sistema?
- **APIs**: Documenta los endpoints principales
- **Variables de Entorno**: Lista las vars de entorno requeridas

### 3. Actualizar `.context/rules/coding-standards.md`

Analiza el estilo de código existente y documenta:
- Convenciones de naming realmente usadas
- Patrones TypeScript/JavaScript
- Formateo de código (tabs vs espacios, longitud de línea, etc.)
- Patrones de testing
- Cualquier regla de linting (configuración ESLint, Prettier)

### 4. Actualizar `.context/project_state.md`

Busca TODOs, FIXMEs y trabajo pendiente:
- Prioridades actuales
- Issues o bugs conocidos
- Deuda técnica
- Features planificadas

### 5. Poblar el Memory Bank

Actualiza los archivos en `.context/memory/`:
- `project_brief.md` — Resume el proyecto en unos párrafos
- `tech_context.md` — ¿Por qué se eligieron estas tecnologías?
- `active_context.md` — ¿En qué se está trabajando ahora?
- `progress.md` — ¿Qué ya está hecho?

---

## Checklist de Completado

Cuando termines, verifica:

- [ ] `AGENTS.md` tiene instrucciones específicas del proyecto añadidas
- [ ] `.context/architecture.md` refleja el stack real
- [ ] `.context/rules/coding-standards.md` coincide con el estilo del código
- [ ] `.context/project_state.md` tiene los TODOs actuales
- [ ] Los archivos `.context/memory/` están poblados
- [ ] Todo el texto `[placeholder]` ha sido reemplazado

---

## Después de Completar

Una vez terminada la configuración:

1. Revisa todos los archivos generados
2. Haz los ajustes manuales necesarios
3. **Elimina este archivo** (`AI_BOOTSTRAP.md`)
4. Haz commit del directorio `.context/` al control de versiones

---

*Este archivo fue generado por agentrc. Es un ayudante de una sola vez y debe eliminarse después de usarlo.*
