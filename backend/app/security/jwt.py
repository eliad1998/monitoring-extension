from functools import lru_cache

from jose import jwt
from jose.exceptions import JWTError
from datetime import datetime, timedelta

from app.core.config import get_settings

ALGORITHM = "HS256"
DEFAULT_ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(user_id:str,username:str, expires_delta: timedelta | None = None) -> str:
    secret_key = get_settings().jwt_secret_key
    to_encode = {'sub': username, 'id' : user_id}
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=DEFAULT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str) -> str | None:
    try:
        secret_key = get_settings().jwt_secret_key
        payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except JWTError:
        return None
