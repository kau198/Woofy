from datetime import UTC, datetime, timedelta

import jwt
from pwdlib import PasswordHash

from .config import get_settings

password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("woofy-dummy-password")


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed: str | None) -> bool:
    return password_hash.verify(password, hashed or DUMMY_HASH)


def create_access_token(user_id: int, session_id: str = "") -> str:
    settings = get_settings()
    now = datetime.now(UTC)
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_expire_minutes),
        "iss": "woofy",
        "jti": session_id,
    }
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


def decode_access_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, get_settings().secret_key, algorithms=["HS256"], issuer="woofy")
        int(payload["sub"])
        return payload
    except (jwt.InvalidTokenError, KeyError, TypeError, ValueError):
        return None
