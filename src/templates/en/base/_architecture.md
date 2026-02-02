# Project Architecture

## Project Goal

[Describe in 2-3 lines what your application does and its main purpose.]

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| [Framework] | vX.X | [Purpose] |
| [UI Library] | vX.X | [Purpose] |
| [State Mgmt] | vX.X | [Purpose] |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| [Runtime/Framework] | vX.X | [Purpose] |
| [ORM/DB Client] | vX.X | [Purpose] |
| [Auth] | vX.X | [Purpose] |

### Database
| Type | Technology | Purpose |
|------|------------|---------|
| Primary | [PostgreSQL/MySQL/MongoDB] | App data |
| Cache | [Redis] | Sessions, cache |

### Infrastructure
| Service | Purpose |
|---------|---------|
| [Vercel/AWS/etc] | Hosting |
| [Cloudflare/etc] | CDN |

## Directory Structure

```
project/
├── src/               # [Describe what it contains]
│   ├── components/    # [Describe]
│   ├── lib/           # [Describe]
│   ├── pages/         # [Describe]
│   └── styles/        # [Describe]
├── public/            # Static assets
├── tests/             # Tests
└── config/            # Configurations
```

## Data Flow

```
[User] → [UI] → [API/Actions] → [DB] → [Response] → [UI Update]
```

1. The user interacts with [component/page]
2. [Action/API call] is triggered
3. [Service/ORM] processes the request
4. [UI update mechanism]

## Authentication and Authorization

- **Method**: [JWT/Session/OAuth/etc]
- **Provider**: [Auth0/Clerk/NextAuth/Custom]
- **Roles**: [Admin, User, Guest, etc]

## APIs and Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/xxx` | Description |
| POST | `/api/xxx` | Description |

## Critical Dependencies

| Package | Why it's important |
|---------|-------------------|
| `package-name` | Reason why it's critical |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | DB connection | ✅ |
| `API_KEY` | Service X key | ✅ |

## Project Conventions

- **Branches**: `main`, `develop`, `feature/*`, `fix/*`
- **Commits**: Conventional Commits
- **Code**: See `.context/rules/coding-standards.md`
