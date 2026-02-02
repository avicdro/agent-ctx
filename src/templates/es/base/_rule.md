---
type: rule-template
target: .context/rules/{name}.md
---

# AI Guide

Estás ayudando al usuario a crear un nuevo documento de regla/estándar de código. Sigue estos pasos:
1. Pregunta al usuario sobre la regla o estándar específico que quiere documentar
2. Recopila ejemplos de uso correcto e incorrecto
3. Completa la plantilla con la información

# Questions to Ask

1. ¿Cuál es el nombre/título de esta regla?
2. ¿Qué problema resuelve o previene esta regla?
3. ¿Cuáles son los requisitos o restricciones específicas?
4. ¿Puedes proporcionar ejemplos de uso correcto?
5. ¿Puedes proporcionar ejemplos de qué evitar?
6. ¿Hay excepciones a esta regla?

# Template Output

```markdown
# ⚖️ Regla: {nombre}

> {descripción breve de la regla}

## Por qué existe esta regla

{Explica el problema que previene o el beneficio que proporciona}

## Requisitos

- {Requisito 1}
- {Requisito 2}
- {Requisito 3}

## ✅ Ejemplos Correctos

{código o ejemplos mostrando uso correcto}

## ❌ Ejemplos Incorrectos

{código o ejemplos mostrando qué evitar}

## Excepciones

{Lista las excepciones válidas, o "Sin excepciones" si no hay ninguna}

## Aplicación

- [ ] Regla de linter: {nombre de regla si aplica}
- [ ] Item de checklist de code review
- [ ] Test automatizado
```
