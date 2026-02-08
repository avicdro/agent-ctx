# Rule: Commit Message Standards

> Write clear, concise, and meaningful commit messages following Conventional Commits.

## Why this rule exists

Good commit messages create a readable project history, enable automated changelog generation, simplify code reviews, and make debugging with `git bisect` more effective.

## Requirements

- Use [Conventional Commits](https://www.conventionalcommits.org/) format
- Keep the subject line under 50 characters (72 max)
- Use imperative mood ("Add feature" not "Added feature")
- Don't end the subject line with a period
- Separate subject from body with a blank line (if body exists)

## Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature for the user |
| `fix` | Bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, missing semicolons, etc. |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `build` | Changes to build system or dependencies |
| `ci` | Changes to CI configuration |
| `chore` | Other changes that don't modify src or tests |

## ✅ Correct Examples

```
feat(init): add Spanish language support
```

```
fix: resolve path resolution on Windows
```

```
docs: update README installation steps
```

```
refactor(logger): extract spinner logic to utility
```

```
feat!: drop support for Node 16

BREAKING CHANGE: Minimum Node version is now 18.
```

## ❌ Incorrect Examples

```
Updated stuff          # Vague, no type
```

```
feat: Added new feature for users to initialize projects with custom templates and support multiple languages  # Too long
```

```
FIX: bug.              # Wrong case, period at end
```

```
wip                    # Not descriptive
```

```
changes                # Meaningless
```

## Scope Guidelines

Use scope when the change affects a specific module:

- `(init)`, `(doctor)`, `(add)` - CLI commands
- `(i18n)` - Internationalization
- `(templates)` - Template files
- `(logger)`, `(bridges)` - Utilities

## Quick Reference

```bash
# Feature
git commit -m "feat(cmd): add new command"

# Bug fix
git commit -m "fix: handle empty input correctly"

# Docs
git commit -m "docs: add usage examples"

# Refactor
git commit -m "refactor: simplify error handling"

# Breaking change
git commit -m "feat!: change config format"
```

## Exceptions

- Merge commits may use default message
- Revert commits should reference the reverted commit

## Enforcement

- [ ] Git hooks with commitlint
- [ ] PR title validation in CI
- [ ] Code review checklist
