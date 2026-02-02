---
name: react-patterns
description: Patrones de componentes React, hooks y mejores prácticas con TypeScript. Usar cuando se crean componentes, custom hooks u optimización de renderizado.
---

# React Patterns

Patrones y mejores prácticas para desarrollo React.

## Cuándo usar

- Crear componentes reutilizables
- Manejar estado complejo
- Optimizar rendimiento de renderizado
- Construir custom hooks

## Patrones de Componentes

### Componente Funcional con Props Tipadas

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

// Uso:
<Card>
  <Card.Header>Título</Card.Header>
  <Card.Body>Contenido</Card.Body>
</Card>
```

## Estructura de Directorios

```
components/
├── ui/           # Componentes base (Button, Input, Modal)
├── features/     # Componentes específicos de features
├── layouts/      # Layouts y wrappers
└── hooks/        # Custom hooks reutilizables
```

## Mejores prácticas

### ✅ Hacer

- Usar `useMemo` y `useCallback` para optimización
- Tipar todas las props con TypeScript
- Extraer lógica a custom hooks
- Composición sobre herencia

### ❌ Evitar

- Props drilling excesivo (usar Context)
- useEffect sin dependencias correctas
- Estado en el componente incorrecto
- Listas sin `key`
