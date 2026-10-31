# Authentication System - Backend Service

A FastAPI-based authentication backend service with JWT authentication, Google OAuth 2.0, active session management, and rate limiting.

---

## Folder Structure

```text
backend/
│
├── app/
│   ├── main.py                     # Application entry point and router registration
│   │
│   ├── core/                       # Core configuration and security
│   │   ├── config.py               # Environment variables
│   │   ├── security.py             # Bcrypt hashing & JWT token operations
│   │   ├── exceptions.py           # Custom exception definitions
│   │   └── logging.py              # Application logging setup
│   │
│   ├── db/                         # Database setup
│   │   ├── database.py             # Engine & table initialization
│   │   ├── base.py                 # Declarative Base
│   │   └── session.py              # SessionLocal & get_db dependency
│   │
│   ├── models/                     # SQLAlchemy models
│   │   ├── user.py                 # User & Session models
│   │   ├── role.py                 # Role model for RBAC
│   │   └── oauth_account.py        # OAuthAccount model
│   │
│   ├── schemas/                    # Pydantic validation schemas
│   │   ├── user.py                 # User request/response schemas
│   │   ├── auth.py                 # OAuth & auth request schemas
│   │   └── token.py                # Token response schemas
│   │
│   ├── api/                        # API versioning
│   │   └── v1/
│   │       └── router.py           # API v1 aggregator router
│   │
│   ├── dependencies/               # FastAPI shared dependencies
│   │   ├── authentication.py       # Current user Bearer token resolver
│   │   ├── authorization.py        # Role / Admin permissions
│   │   └── database.py             # Database session dependency
│   │
│   ├── services/                   # Business logic layer
│   │   ├── auth_service.py         # Login, register, refresh, session tracking
│   │   ├── user_service.py         # Profile & user queries
│   │   └── oauth_service.py        # Google token verification
│   │
│   ├── repositories/               # Data access layer
│   │   ├── user_repository.py      # User and session queries
│   │   └── oauth_repository.py     # OAuth account queries
│   │
│   ├── routers/                    # Route handlers
│   │   ├── auth.py                 # /auth/* and /sessions/* routes
│   │   ├── users.py                # /users/* routes
│   │   └── admin.py                # /admin/* routes
│   │
│   ├── utils/                      # Reusable utilities
│   │   ├── email.py                # Email dispatch utility
│   │   └── validate.py             # Password complexity validator
│   │
│   └── middleware/                 # Middleware
│       └── rate_limit.py           # SlowAPI rate limiter instance
│
├── migrations/                     # Alembic database migrations
├── tests/                          # Test suites (unit & integration)
├── .env.example                    # Environment template
├── alembic.ini                     # Alembic configuration
└── requirements.txt                # Python dependencies
```

---

## Running the Backend

1. **Activate the virtual environment**:
   ```bash
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   source venv/bin/activate
   ```

2. **Start the development server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

3. **Interactive Documentation**:
   - Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
