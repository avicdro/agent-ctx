# Arquitectura del Proyecto

## Objetivo del Proyecto

[Describe en 2-3 líneas qué hace tu aplicación y cuál es su propósito principal.]

## Tech Stack

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| [Framework] | vX.X | [Propósito] |
| [UI Library] | vX.X | [Propósito] |
| [State Mgmt] | vX.X | [Propósito] |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| [Runtime/Framework] | vX.X | [Propósito] |
| [ORM/DB Client] | vX.X | [Propósito] |
| [Auth] | vX.X | [Propósito] |

### Base de Datos
| Tipo | Tecnología | Propósito |
|------|------------|-----------|
| Principal | [PostgreSQL/MySQL/MongoDB] | Datos de la app |
| Cache | [Redis] | Sesiones, cache |

### Infraestructura
| Servicio | Propósito |
|----------|-----------|
| [Vercel/AWS/etc] | Hosting |
| [Cloudflare/etc] | CDN |

## Estructura de Directorios

```
proyecto/
├── src/               # [Describe qué contiene]
│   ├── components/    # [Describe]
│   ├── lib/           # [Describe]
│   ├── pages/         # [Describe]
│   └── styles/        # [Describe]
├── public/            # Assets estáticos
├── tests/             # Tests
└── config/            # Configuraciones
```

## Flujo de Datos

```
[Usuario] → [UI] → [API/Actions] → [DB] → [Response] → [UI Update]
```

1. El usuario interactúa con [componente/página]
2. Se dispara [acción/API call]
3. [Servicio/ORM] procesa la solicitud
4. [Mecanismo de actualización de UI]

## Autenticación y Autorización

- **Método**: [JWT/Session/OAuth/etc]
- **Provider**: [Auth0/Clerk/NextAuth/Custom]
- **Roles**: [Admin, User, Guest, etc]

## APIs y Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/xxx` | Descripción |
| POST | `/api/xxx` | Descripción |

## Dependencias Críticas

| Paquete | Por qué es importante |
|---------|----------------------|
| `nombre-paquete` | Razón por la que es crítico |

## Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `DATABASE_URL` | Conexión a DB | Sí |
| `API_KEY` | Key de servicio X | Sí |

## Convenciones del Proyecto

- **Branches**: `main`, `develop`, `feature/*`, `fix/*`
- **Commits**: Conventional Commits
- **Código**: Ver `.context/rules/coding-standards.md`
