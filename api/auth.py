import os
from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext
import jwt

# Parollarni xesh qilish uchun sozlamalar
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT sozlamalari
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "maxfiy_kalit")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 kun

# Parolni tekshirish
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Parolni xesh qilish
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# JWT token yaratish
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# JWT tokenni tekshirish va ma'lumotlarni olish
def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
