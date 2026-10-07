import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Ma'lumotlar bazasi manzili
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    # Vercel Serverless muxitida faqat /tmp papkasiga yozish mumkin
    SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/test.db"

if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# Engine yaratish
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)

# Sessiya yaratish
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Asosiy model (Base)
Base = declarative_base()

# Ma'lumotlar bazasi sessiyasini olish uchun yordamchi funksiya
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
