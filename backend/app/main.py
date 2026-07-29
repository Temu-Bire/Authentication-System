
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.core.limiter import limiter
from app.db.database import init_db
from app.routers.auth import router

# Create database tables & apply schema updates on startup
init_db()


app = FastAPI(
    title="Authentication System API",
    description="JWT + Google OAuth authentication backend",
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

app.include_router(router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Authentication API is running"}