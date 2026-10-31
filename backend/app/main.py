from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.api.v1.router import api_v1_router
from app.core.logging import logger
from app.db.database import init_db
from app.middleware.rate_limit import limiter

# Create database tables & apply schema updates on startup
init_db()

app = FastAPI(
    title="Authentication System API",
    description="JWT + Google OAuth authentication backend with session management",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
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
def health_check():
    return {"status": "ok", "message": "Authentication API is running"}
