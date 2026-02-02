---
name: testing-practices
description: Testing strategies, patterns, and best practices with Jest/Vitest. Use when writing unit tests, integration tests, or mocking dependencies.
---

# Testing Practices

Strategies and patterns for effective testing.

## When to use

- Writing unit tests
- Creating integration tests
- Mocking dependencies
- Testing React components

## Testing Pyramid

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

### Basic Test

```typescript
import { describe, it, expect } from 'vitest';
import { sum } from './sum';

describe('sum', () => {
  it('should add two positive numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
  
  it('should handle negative numbers', () => {
    expect(sum(-1, 1)).toBe(0);
  });
});
```

### Test with Setup/Teardown

```typescript
describe('UserService', () => {
  let service: UserService;
  
  beforeEach(() => {
    service = new UserService();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('should create a user', async () => {
    const user = await service.create({ name: 'Test' });
    expect(user.id).toBeDefined();
  });
});
```

## Mocking

```typescript
// Module mock
vi.mock('./database', () => ({
  query: vi.fn().mockResolvedValue([{ id: 1, name: 'Test' }])
}));

// Function mock
const mockFetch = vi.fn().mockResolvedValue({
  json: () => Promise.resolve({ data: 'test' })
});

// Spy
const spy = vi.spyOn(console, 'log');
myFunction();
expect(spy).toHaveBeenCalledWith('expected message');
```

## React Testing Library

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

test('should display and interact with button', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  const button = screen.getByRole('button', { name: /click me/i });
  expect(button).toBeInTheDocument();
  
  await fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Test Structure

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

## Best practices

### ✅ Do

- One assertion per test (when possible)
- Descriptive names: `should_X_when_Y`
- Arrange-Act-Assert (AAA)
- Independent tests

### ❌ Avoid

- Tests that depend on order
- Logic in tests
- Flaky tests (intermittent)
- Mocking everything

## Coverage Targets

- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%
