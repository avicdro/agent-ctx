---
type: rule-template
target: .context/rules/{name}.md
---

# AI Guide

You are helping the user create a new coding rule/standard document. Follow these steps:
1. Ask the user about the specific rule or standard they want to document
2. Gather examples of correct and incorrect usage
3. Fill in the template below with the information

# Questions to Ask

1. What is the name/title of this rule?
2. What problem does this rule solve or prevent?
3. What are the specific requirements or constraints?
4. Can you provide examples of correct usage?
5. Can you provide examples of what to avoid?
6. Are there any exceptions to this rule?

# Template Output

```markdown
# ⚖️ Rule: {name}

> {brief description of the rule}

## Why this rule exists

{Explain the problem this rule prevents or the benefit it provides}

## Requirements

- {Requirement 1}
- {Requirement 2}
- {Requirement 3}

## ✅ Correct Examples

{code or examples showing correct usage}

## ❌ Incorrect Examples

{code or examples showing what to avoid}

## Exceptions

{List any valid exceptions to this rule, or "No exceptions" if none}

## Enforcement

- [ ] Linter rule: {rule name if applicable}
- [ ] Code review checklist item
- [ ] Automated test
```
