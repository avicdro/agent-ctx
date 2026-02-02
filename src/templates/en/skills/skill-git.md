---
name: git-workflow
description: Git conventions, branching strategies, and commit message formatting. Use when creating commits, branches, PRs, or resolving git conflicts.
---

# Git Workflow

Git conventions, commits, and workflow patterns.

## When to use

- Writing commit messages
- Creating feature branches
- Managing pull requests
- Resolving conflicts or rebasing

## Commit Messages (Conventional Commits)

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting (no code change) |
| `refactor` | Code refactoring |
| `test` | Add/modify tests |
| `chore` | Maintenance, deps |
| `perf` | Performance improvement |

### Examples

```bash
feat(auth): add login with Google OAuth
fix(api): handle null response in user fetch
docs: update installation guide
refactor(utils): simplify date formatting function

# Breaking change
feat(api)!: change response format

BREAKING CHANGE: Response now returns data in `result` instead of `data`
```

## Branching Strategy (Git Flow)

```
main (production)
  │
  └── develop (development)
        │
        ├── feature/new-feature
        ├── bugfix/fix-bug
        └── release/v1.2.0
```

### Create Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/descriptive-name
```

## Useful Commands

```bash
# Stash
git stash                    # Save changes
git stash pop                # Restore changes

# Interactive Rebase
git rebase -i HEAD~3         # Last 3 commits

# Cherry Pick
git cherry-pick abc123       # Apply specific commit

# Bisect (find bug)
git bisect start
git bisect bad               # Current commit has bug
git bisect good abc123       # Known good commit
```

## Best practices

### ✅ Do

- Atomic commits (one logical change per commit)
- Small, focused PRs
- Rebase before merge
- Squash WIP commits

### ❌ Avoid

- Commits with just "fix" or "update"
- Giant PRs (>500 lines)
- Force push to shared branches
- Mixing refactors with features
