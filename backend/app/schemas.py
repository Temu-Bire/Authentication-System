from pydantic import BaseModel, EmailStr

class Base(BaseModel):
    email: EmailStr


class UserCreate(Base):
    password: str


class UserLogin(Base):
    password: str


class UserResponse(Base):
    id: int
 

    class Config:
        from_attributes = True