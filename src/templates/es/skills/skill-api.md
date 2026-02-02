---
name: api-design
description: Diseña APIs REST con patrones consistentes, códigos HTTP apropiados y validación. Usar cuando se crean endpoints, manejo de errores o versionado de APIs.
---

# API Design

Patrones y mejores prácticas para diseñar APIs REST.

## Cuándo usar

- Diseñar endpoints REST
- Manejar errores de forma consistente
- Versionado de APIs
- Validación de requests

## Convenciones REST

### Estructura de URLs

```
GET    /api/v1/users          # Listar usuarios
GET    /api/v1/users/:id      # Obtener usuario
POST   /api/v1/users          # Crear usuario
PUT    /api/v1/users/:id      # Actualizar completo
PATCH  /api/v1/users/:id      # Actualizar parcial
DELETE /api/v1/users/:id      # Eliminar usuario
```

### Query Parameters

```
GET /api/v1/users?
  page=1&                     # Paginación
  limit=20&                   # Items por página
  sort=createdAt:desc&        # Ordenamiento
  filter[status]=active       # Filtros
```

## Respuestas Estándar

### Éxito (200, 201)

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

## Códigos HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | GET, PUT/PATCH exitoso |
| 201 | Created | POST exitoso |
| 204 | No Content | DELETE exitoso |
| 400 | Bad Request | Validación fallida |
| 401 | Unauthorized | No autenticado |
| 403 | Forbidden | Sin permisos |
| 404 | Not Found | Recurso no existe |
| 500 | Server Error | Error interno |

## Ejemplo de Validación

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

## Mejores prácticas

### ✅ Hacer

- Usar HTTPS siempre
- Versionado en URL (`/api/v1/`)
- Rate limiting
- Respuestas consistentes

### ❌ Evitar

- Verbos en URLs (`/getUsers`, `/deleteUser`)
- Exponer IDs internos
- Respuestas sin formato estándar
