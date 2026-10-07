from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from . import models, database, auth, rbac
from .database import engine, get_db

# Ma'lumotlar bazasi jadvallarini yaratish
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Elektron Boshqaruv API")

# Kiruvchi ma'lumotlar modeli
class LoginRequest(BaseModel):
    username: str
    password: str

# Chiquvchi ma'lumotlar modeli
class UserResponse(BaseModel):
    id: int
    full_name: str
    username: str
    email: str
    role: str
    is_active: bool
    permissions: List[str]

# Tizimga kirish
@app.post("/api/auth/login")
def login(login_data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    # Foydalanuvchini bazadan qidirish
    user = db.query(models.User).filter(models.User.username == login_data.username).first()
    
    # Foydalanuvchi mavjudligi va parol to'g'riligini tekshirish
    if not user or not auth.verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Noto'g'ri foydalanuvchi nomi yoki parol",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Foydalanuvchi faol emas",
        )
    
    # Token yaratish
    access_token = auth.create_access_token(data={"sub": user.username, "role": user.role.value})
    
    # Tokenni cookie-ga saqlash
    response.set_cookie(
        key="auth-token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=86400  # 1 kun
    )
    
    return {"message": "Tizimga muvaffaqiyatli kirdingiz"}

# Tizimdan chiqish
@app.post("/api/auth/logout")
def logout(response: Response):
    # Cookie-ni tozalash
    response.delete_cookie("auth-token")
    return {"message": "Tizimdan muvaffaqiyatli chiqdingiz"}

# Foydalanuvchi ma'lumotlarini olish
@app.get("/api/auth/me", response_model=UserResponse)
def get_me(request: Request, db: Session = Depends(get_db)):
    # Cookie-dan tokenni olish
    token = request.cookies.get("auth-token")
    
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Avtorizatsiyadan o'tilmagan")
        
    payload = auth.verify_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Yaroqsiz token")
        
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Yaroqsiz token ma'lumotlari")
        
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Foydalanuvchi topilmadi")
        
    permissions = rbac.get_permissions_for_role(user.role.value)
    
    return {
        "id": user.id,
        "full_name": user.full_name,
        "username": user.username,
        "email": user.email,
        "role": user.role.value,
        "is_active": user.is_active,
        "permissions": permissions
    }
