import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Ma'lumotlar bazasi manzili
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./test.db")

# Engine yaratish
engine = create_engine(SQLALCHEMY_DATABASE_URL)

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
