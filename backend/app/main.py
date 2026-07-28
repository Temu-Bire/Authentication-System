from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.limiter import limiter

from app.database import Base, engine
from app.auth import router

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Simple Authentication System"
)

# Allowed frontend origins
origins = [
    "http://localhost:5173",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# connect limiter with FastAPI
app.state.limiter = limiter


# handle limit error
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)

# Register routes
app.include_router(router)

@app.get("/")
def home():
    return {
        "message": "Authentication API"
    }