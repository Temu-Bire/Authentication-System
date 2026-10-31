import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.api.v1.router import api_v1_router
from app.core.logging import logger
from app.db.database import init_db
from app.middleware.rate_limit import limiter

# Create database tables & apply schema updates on startup
init_db()

app = FastAPI(
    title="NexusAuth API",
    description="JWT + Google OAuth 2.0 authentication backend with session management",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Trust reverse proxy headers (X-Forwarded-For, X-Forwarded-Proto) in production
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

# Dynamic CORS Configuration from Environment
cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env.strip():
    origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
else:
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost",
        "http://127.0.0.1",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Include routes at root for frontend backward-compatibility and at /api/v1 for versioning
app.include_router(api_v1_router)
app.include_router(api_v1_router, prefix="/api/v1")


@app.get("/", tags=["Health"])
def root_check():
    return {
        "status": "ok",
        "service": "NexusAuth API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "NexusAuth API",
        "version": "1.0.0",
    }
