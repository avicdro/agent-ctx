---
name: testing-practices
description: Estrategias de testing, patrones y mejores prácticas con Jest/Vitest. Usar cuando se escriben unit tests, integration tests o mocking de dependencias.
---

# Testing Practices

Estrategias y patrones para testing efectivo.

## Cuándo usar

- Escribir unit tests
- Crear integration tests
- Mockear dependencias
- Testear componentes React

## Pirámide de Testing

```
        /\
       /  \     E2E Tests (Playwright, Cypress)
      /----\    
     /      \   Integration Tests
    /--------\  
   /          \ Unit Tests
  /____________\
```

## Unit Tests (Vitest)

### Test Básico

```typescript
import { describe, it, expect } from 'vitest';
import { sum } from './sum';

describe('sum', () => {
  it('debería sumar dos números positivos', () => {
    expect(sum(1, 2)).toBe(3);
  });
  
  it('debería manejar números negativos', () => {
    expect(sum(-1, 1)).toBe(0);
  });
});
```

### Test con Setup/Teardown

```typescript
describe('UserService', () => {
  let service: UserService;
  
  beforeEach(() => {
    service = new UserService();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('debería crear un usuario', async () => {
    const user = await service.create({ name: 'Test' });
    expect(user.id).toBeDefined();
  });
});
```

## Mocking

```typescript
// Mock de módulo
vi.mock('./database', () => ({
  query: vi.fn().mockResolvedValue([{ id: 1, name: 'Test' }])
}));

// Mock de función
const mockFetch = vi.fn().mockResolvedValue({
  json: () => Promise.resolve({ data: 'test' })
});

// Spy
const spy = vi.spyOn(console, 'log');
myFunction();
expect(spy).toHaveBeenCalledWith('mensaje esperado');
```

## React Testing Library

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

test('debería mostrar e interactuar con botón', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  const button = screen.getByRole('button', { name: /click me/i });
  expect(button).toBeInTheDocument();
  
  await fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Estructura de Tests

```
__tests__/
├── unit/
│   ├── services/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
    └── flows/
```

## Mejores prácticas

### ✅ Hacer

- Una aserción por test (cuando sea posible)
- Nombres descriptivos: `debería_X_cuando_Y`
- Arrange-Act-Assert (AAA)
- Tests independientes

### ❌ Evitar

- Tests que dependen del orden
- Lógica en tests
- Tests flaky (intermitentes)
- Mockear todo indiscriminadamente

## Cobertura Recomendada

- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%
