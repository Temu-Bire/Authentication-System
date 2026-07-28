from fastapi import FastAPI

from app.database import Base, engine
from app.auth import router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Simple Authentication System"
)

app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "Authentication API"
    }