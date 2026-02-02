---
name: react-patterns
description: React component patterns, hooks, and best practices for TypeScript. Use when creating components, custom hooks, or optimizing rendering.
---

# React Patterns

Patterns and best practices for React development.

## When to use

- Creating reusable components
- Handling complex state
- Optimizing rendering performance
- Building custom hooks

## Component Patterns

### Functional Component with Typed Props

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ variant, children, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### Custom Hook

```tsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse };
}
```

### Compound Components

```tsx
const Card = ({ children }) => <div className="card">{children}</div>;
Card.Header = ({ children }) => <div className="card-header">{children}</div>;
Card.Body = ({ children }) => <div className="card-body">{children}</div>;

// Usage:
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

## Directory Structure

```
components/
├── ui/           # Base components (Button, Input, Modal)
├── features/     # Feature-specific components
├── layouts/      # Layouts and wrappers
└── hooks/        # Reusable custom hooks
```

## Best practices

### ✅ Do

- Use `useMemo` and `useCallback` for optimization
- Type all props with TypeScript
- Extract logic to custom hooks
- Use composition over inheritance

### ❌ Avoid

- Excessive props drilling (use Context)
- useEffect without correct dependencies
- State in the wrong component
- Rendering lists without `key`
