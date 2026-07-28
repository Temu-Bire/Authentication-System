from datetime import datetime, timedelta

from jose import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
import re
# Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# JWT settings
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))



def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token
def validate_password(password: str):

    errors = []

    # Minimum length
    if len(password) < 8:
        errors.append(
            "Password must be at least 8 characters"
        )

    # Uppercase
    if not re.search(r"[A-Z]", password):
        errors.append(
            "Password must contain uppercase letter"
        )

    # Lowercase
    if not re.search(r"[a-z]", password):
        errors.append(
            "Password must contain lowercase letter"
        )

    # Number
    if not re.search(r"\d", password):
        errors.append(
            "Password must contain a number"
        )

    # Special character
    if not re.search(r"[@$!%*?&]", password):
        errors.append(
            "Password must contain special character"
        )


    if errors:
        return False, errors


    return True, []