---
name: api-design
description: Design REST APIs with consistent patterns, proper HTTP status codes, and validation. Use when creating endpoints, handling errors, or implementing API versioning.
---

# API Design

Patterns and best practices for designing REST APIs.

## When to use

- Designing REST endpoints
- Handling errors consistently
- Implementing API versioning
- Adding request validation

## REST Conventions

### URL Structure

```
GET    /api/v1/users          # List users
GET    /api/v1/users/:id      # Get user
POST   /api/v1/users          # Create user
PUT    /api/v1/users/:id      # Full update
PATCH  /api/v1/users/:id      # Partial update
DELETE /api/v1/users/:id      # Delete user
```

### Query Parameters

```
GET /api/v1/users?
  page=1&                     # Pagination
  limit=20&                   # Items per page
  sort=createdAt:desc&        # Sorting
  filter[status]=active       # Filters
```

## Standard Responses

### Success (200, 201)

```json
{
  "success": true,
  "data": { "id": "123", "name": "John Doe" },
  "meta": { "page": 1, "total": 100 }
}
```

### Error (400, 404, 500)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [{ "field": "email", "message": "Required" }]
  }
}
```

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT/PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation failed |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | No permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal error |

## Validation Example

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['admin', 'user'])
});

export function validate(schema: z.ZodSchema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', details: result.error.issues }
      });
    }
    req.body = result.data;
    next();
  };
}
```

## Best practices

### ✅ Do

- Always use HTTPS
- Version in URL (`/api/v1/`)
- Rate limiting
- Consistent response format

### ❌ Avoid

- Verbs in URLs (`/getUsers`, `/deleteUser`)
- Exposing internal IDs
- Inconsistent response formats
