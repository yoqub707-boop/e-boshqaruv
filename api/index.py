from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from . import models, database, auth, rbac
from .database import engine, get_db

app = FastAPI(title="Elektron Boshqaruv API")

# Jadvallarni xavfsiz yaratish va dastlabki ma'lumotlarni qo'shish
@app.on_event("startup")
def startup_event():
    try:
        models.Base.metadata.create_all(bind=engine)
        
        # Dastlabki admin/hokim foydalanuvchilarini avtomatik yaratish
        db = database.SessionLocal()
        try:
            admin_user = db.query(models.User).filter(models.User.username == "admin").first()
            if not admin_user:
                admin_user = models.User(
                    full_name="Moderator (Admin)",
                    username="admin",
                    email="admin@e-boshqaruv.uz",
                    password_hash=auth.get_password_hash("Admin@2024"),
                    role=models.RoleEnum.MODERATOR,
                    is_active=True
                )
                db.add(admin_user)

            hokim_user = db.query(models.User).filter(models.User.username == "hokim").first()
            if not hokim_user:
                hokim_user = models.User(
                    full_name="Tuman Hokimi",
                    username="hokim",
                    email="hokim@e-boshqaruv.uz",
                    password_hash=auth.get_password_hash("Hokim@2024"),
                    role=models.RoleEnum.MAYOR,
                    is_active=True
                )
                db.add(hokim_user)
                
            db.commit()
        except Exception as e:
            print("Seed error:", e)
            db.rollback()
        finally:
            db.close()
    except Exception as e:
        print("Startup DB error:", e)

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    fullName: str
    username: str
    email: str
    role: str
    roleDisplayName: str
    isActive: bool
    permissions: List[str]

@app.post("/api/auth/login")
def login(login_data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == login_data.username).first()
    
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
    
    access_token = auth.create_access_token(data={"sub": user.username, "role": user.role.value})
    
    response.set_cookie(
        key="auth-token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=86400
    )
    
    return {
        "success": True,
        "message": "Tizimga muvaffaqiyatli kirdingiz",
        "user": {
            "id": user.id,
            "fullName": user.full_name,
            "username": user.username,
            "email": user.email,
            "role": user.role.value,
            "roleDisplayName": rbac.get_role_display_name(user.role.value)
        }
    }

@app.post("/api/auth/logout")
def logout(response: Response):
    response.delete_cookie("auth-token")
    return {"success": True, "message": "Tizimdan muvaffaqiyatli chiqdingiz"}

@app.get("/api/auth/me")
def get_me(request: Request, db: Session = Depends(get_db)):
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
        "user": {
            "id": user.id,
            "fullName": user.full_name,
            "username": user.username,
            "email": user.email,
            "role": user.role.value,
            "roleDisplayName": rbac.get_role_display_name(user.role.value),
            "isActive": user.is_active,
            "permissions": permissions
        }
    }
