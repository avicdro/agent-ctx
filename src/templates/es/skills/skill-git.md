---
name: git-workflow
description: Convenciones Git, estrategias de branching y formato de commits. Usar cuando se crean commits, branches, PRs o se resuelven conflictos.
---

# Git Workflow

Convenciones Git, commits y patrones de flujo de trabajo.

## Cuándo usar

- Escribir mensajes de commit
- Crear feature branches
- Gestionar pull requests
- Resolver conflictos o hacer rebase

## Commits (Conventional Commits)

### Formato

```
<type>(<scope>): <description>

[cuerpo opcional]

[footer opcional]
```

### Tipos

| Tipo | Descripción |
|------|-------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Solo documentación |
| `style` | Formato (sin cambio de código) |
| `refactor` | Refactorización |
| `test` | Añadir/modificar tests |
| `chore` | Mantenimiento, deps |
| `perf` | Mejora de rendimiento |

### Ejemplos

```bash
feat(auth): añadir login con Google OAuth
fix(api): manejar respuesta null en fetch de usuario
docs: actualizar guía de instalación

# Breaking change
feat(api)!: cambiar formato de respuesta

BREAKING CHANGE: Response ahora devuelve datos en `result` en vez de `data`
```

## Estrategia de Branching (Git Flow)

```
main (producción)
  │
  └── develop (desarrollo)
        │
        ├── feature/nueva-funcionalidad
        ├── bugfix/corregir-bug
        └── release/v1.2.0
```

### Crear Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-descriptivo
```

## Comandos Útiles

```bash
# Stash
git stash                    # Guardar cambios
git stash pop                # Restaurar cambios

# Rebase interactivo
git rebase -i HEAD~3         # Últimos 3 commits

# Cherry Pick
git cherry-pick abc123       # Aplicar commit específico

# Bisect (encontrar bug)
git bisect start
git bisect bad               # Commit actual tiene bug
git bisect good abc123       # Commit bueno conocido
```

## Mejores prácticas

### ✅ Hacer

- Commits atómicos (un cambio lógico por commit)
- PRs pequeños y enfocados
- Rebase antes de merge
- Squash commits WIP

### ❌ Evitar

- Commits con solo "fix" o "update"
- PRs gigantes (>500 líneas)
- Force push a branches compartidas
- Mezclar refactors con features
