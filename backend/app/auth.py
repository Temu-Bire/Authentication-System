from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, UserResponse
from app.security import (
    hash_password,
    validate_password,
    verify_password,
    create_access_token,
    create_refresh_token
)
from app.limiter import limiter
MAX_ATTEMPTS = 5
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    email = db.query(User).filter(User.email == user.email).first()
    is_valid, errors = validate_password(user.password)
    
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail=errors
        )   

    if email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(
        {"sub": new_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email
        }
    }

@router.post("/login")
@limiter.limit("5/minute")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    if db_user.locked_until:

        if db_user.locked_until > datetime.utcnow():

            raise HTTPException(
                status_code=403,
                detail="Account temporarily locked"
            )

    else:
        db_user.locked_until = None
        db_user.failed_login_attempts = 0
    if not verify_password(
        user.password,
        db_user.password
    ):

        db_user.failed_login_attempts += 1


        if db_user.failed_login_attempts >= MAX_ATTEMPTS:

            db_user.locked_until = (
                datetime.utcnow()
                + timedelta(minutes=15)
            )


        db.commit()


        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    # Successful login

    db_user.failed_login_attempts = 0

    access_token = create_access_token(
    {
        "sub": db_user.email
    }
)


    refresh_token = create_refresh_token(
    {
        "sub": db_user.email
    }
)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
@router.post("/refresh")
def refresh_token(refresh_token:str):

    try:

        payload = jwt.decode(
            refresh_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )


        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )


        email = payload.get("sub")


        new_access_token = create_access_token(
            {
                "sub":email
            }
        )


        return {
            "access_token":new_access_token,
            "token_type":"bearer"
        }


    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token"
        )

@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()