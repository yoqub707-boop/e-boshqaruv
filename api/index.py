from fastapi import FastAPI, Depends, HTTPException, status, Response, Request, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Any

from . import models, database, auth, rbac
from .database import engine, get_db

app = FastAPI(
    title="Elektron Hokimiyat (E-Boshqaruv) API",
    description="Tuman hokimligi uchun ijtimoiy-iqtisodiy tahlil va monitoring API tizimi",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# CORS sozlamalari
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dastlabki ma'lumotlarni xavfsiz yuklash (Seed)
@app.on_event("startup")
def startup_event():
    try:
        models.Base.metadata.create_all(bind=engine)
        db = database.SessionLocal()
        try:
            # 1. Foydalanuvchilar
            if not db.query(models.User).first():
                users_data = [
                    ("Moderator (Bosh administrator)", "admin", "admin@e-boshqaruv.uz", "Admin@2024", models.RoleEnum.MODERATOR),
                    ("Tuman Hokimi", "hokim", "hokim@e-boshqaruv.uz", "Hokim@2024", models.RoleEnum.MAYOR),
                    ("Iqtisodiyot bo'yicha o'rinbosar", "orinbosar_iqtisod", "iqtisod@e-boshqaruv.uz", "Iqtisod@2024", models.RoleEnum.DEPUTY_ECONOMY),
                    ("Ijtimoiy masalalar o'rinbosari", "orinbosar_ijtimoiy", "ijtimoiy@e-boshqaruv.uz", "Ijtimoiy@2024", models.RoleEnum.DEPUTY_SOCIAL),
                    ("Qurilish bo'yicha o'rinbosar", "orinbosar_qurilish", "qurilish@e-boshqaruv.uz", "Qurilish@2024", models.RoleEnum.DEPUTY_CONSTRUCTION),
                    ("Qishloq xo'jaligi o'rinbosari", "orinbosar_qishloq", "qishloq@e-boshqaruv.uz", "Qishloq@2024", models.RoleEnum.DEPUTY_AGRICULTURE),
                ]
                for full_name, username, email, pwd, role in users_data:
                    u = models.User(
                        full_name=full_name,
                        username=username,
                        email=email,
                        password_hash=auth.get_password_hash(pwd),
                        role=role,
                        is_active=True
                    )
                    db.add(u)

            # 2. Mahallalar
            if not db.query(models.Mahalla).first():
                mahallas = [
                    ("Navbahor", "A. Rustamov", 5420, 1250, 94.5),
                    ("Gulshan", "B. Alimov", 4800, 1100, 98.0),
                    ("Do'stlik", "O. Qodirov", 6200, 1420, 91.2),
                    ("Alisher Navoiy", "S. Karimov", 7100, 1650, 96.0),
                    ("O'zbekiston", "T. Yusupov", 5900, 1380, 89.5),
                ]
                for name, ch, pop, hh, rate in mahallas:
                    db.add(models.Mahalla(name=name, chairman=ch, population=pop, households=hh, problem_cases_resolved_percent=rate))

            # 3. Soliq tushumlari
            if not db.query(models.TaxRevenue).first():
                taxes = [
                    ("QQS", "Yanvar", 2500000000, 2350000000, 94.0),
                    ("Foyda solig'i", "Yanvar", 1800000000, 1750000000, 97.2),
                    ("Mol-mulk solig'i", "Yanvar", 800000000, 720000000, 90.0),
                    ("Yer solig'i", "Yanvar", 600000000, 580000000, 96.7),
                    ("QQS", "Fevral", 2700000000, 2680000000, 99.3),
                    ("Foyda solig'i", "Fevral", 1900000000, 1820000000, 95.8),
                ]
                for tt, m, pl, ac, rt in taxes:
                    db.add(models.TaxRevenue(tax_type=tt, month=m, planned_amount=pl, actual_amount=ac, execution_rate=rt))

            # 4. Migratsiya
            if not db.query(models.Migration).first():
                mig_data = [
                    ("Rossiya", "RU", 8450, 2100, "Mehnat", "🇷🇺"),
                    ("Qozog'iston", "KZ", 1560, 890, "Mehnat", "🇰🇿"),
                    ("Turkiya", "TR", 980, 320, "Mehnat", "🇹🇷"),
                    ("Janubiy Koreya", "KR", 750, 180, "Mehnat", "🇰🇷"),
                    ("AQSh", "US", 320, 45, "Doimiy", "🇺🇸"),
                ]
                for c, cc, mc, rc, mt, fl in mig_data:
                    db.add(models.Migration(country=c, country_code=cc, migrant_count=mc, returned_count=rc, migration_type=mt, flag=fl))

            # 5. Qurilish loyihalari
            if not db.query(models.ConstructionProject).first():
                projects = [
                    ("20-umumiy o'rta ta'lim maktabi rekonstruksiyasi", "Binokor MCHJ", 4500000000, 3800000000, 85.0, "JARAYONDA"),
                    ("Yangi ko'p tarmoqli poliklinika qurilishi", "Shahar Qurilish AJ", 8200000000, 8200000000, 100.0, "YAKUNLANGAN"),
                    ("Markaziy istirohat bog'i obodonlashtirish", "Yashil Diyor UK", 2100000000, 950000000, 45.0, "KECHIKMOQDA"),
                ]
                for n, ct, bg, sp, pr, st in projects:
                    db.add(models.ConstructionProject(name=n, contractor=ct, budget=bg, spent_amount=sp, progress_percent=pr, status=st))

            # 6. Qishloq xo'jaligi
            if not db.query(models.Agriculture).first():
                crops = [
                    ("Paxta", 12500, 45000, 98.2),
                    ("G'alla", 18200, 72000, 104.5),
                    ("Meva-sabzavot", 6400, 38000, 95.0),
                    ("Poliz ekinlari", 3100, 22000, 101.0),
                ]
                for ct, pa, ey, er in crops:
                    db.add(models.Agriculture(crop_type=ct, planted_area=pa, expected_yield=ey, execution_rate=er))

            db.commit()
        except Exception as e:
            print("Seed error:", e)
            db.rollback()
        finally:
            db.close()
    except Exception as e:
        print("Startup error:", e)

# API Router yaratish
router = APIRouter()

# Schema modellari
class LoginRequest(BaseModel):
    username: str
    password: str

@router.get("/")
@router.get("/health")
def root():
    return {"status": "ok", "message": "E-Boshqaruv API tizimi faol ishlamoqda"}

# --- AUTH ENDPOINTS ---

@router.post("/auth/login")
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

@router.post("/auth/logout")
def logout(response: Response):
    response.delete_cookie("auth-token")
    return {"success": True, "message": "Tizimdan muvaffaqiyatli chiqdingiz"}

@router.get("/auth/me")
def get_me(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("auth-token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Avtorizatsiyadan o'tilmagan")
        
    payload = auth.verify_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Yaroqsiz token")
        
    username = payload.get("sub")
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

# --- MODULE DATA ENDPOINTS ---

@router.get("/mahallas")
def get_mahallas(db: Session = Depends(get_db)):
    return db.query(models.Mahalla).all()

@router.get("/tax-revenues")
def get_tax_revenues(db: Session = Depends(get_db)):
    return db.query(models.TaxRevenue).all()

@router.get("/migrations")
def get_migrations(db: Session = Depends(get_db)):
    return db.query(models.Migration).all()

@router.get("/construction-projects")
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.ConstructionProject).all()

@router.get("/agricultures")
def get_agricultures(db: Session = Depends(get_db)):
    return db.query(models.Agriculture).all()

# Routerlarni ulash (ham /api prefixi bilan, ham to'g'ridan-to'g'ri)
app.include_router(router, prefix="/api")
app.include_router(router)
