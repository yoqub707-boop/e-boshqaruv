from sqlalchemy import Column, Integer, String, Float, Boolean, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from .database import Base

# Foydalanuvchi rollari (6 ta asosiy rol)
class RoleEnum(str, enum.Enum):
    MAYOR = "MAYOR"                          # Tuman Hokimi - faqat ko'rish
    DEPUTY_ECONOMY = "DEPUTY_ECONOMY"        # Iqtisodiyot bo'yicha o'rinbosar
    DEPUTY_SOCIAL = "DEPUTY_SOCIAL"          # Ijtimoiy masalalar bo'yicha o'rinbosar
    DEPUTY_CONSTRUCTION = "DEPUTY_CONSTRUCTION" # Qurilish bo'yicha o'rinbosar
    DEPUTY_AGRICULTURE = "DEPUTY_AGRICULTURE" # Qishloq xo'jaligi bo'yicha o'rinbosar
    MODERATOR = "MODERATOR"                  # Moderator / Tahlilchi - to'liq huquq

# Foydalanuvchi modeli
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(Enum(RoleEnum), default=RoleEnum.MAYOR)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Mahalla modeli
class Mahalla(Base):
    __tablename__ = "mahallas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    chairman = Column(String)
    population = Column(Integer, default=0)
    households = Column(Integer, default=0)
    problem_cases_resolved_percent = Column(Float, default=100.0)

# Soliq tushumlari
class TaxRevenue(Base):
    __tablename__ = "tax_revenues"

    id = Column(Integer, primary_key=True, index=True)
    tax_type = Column(String, index=True)
    month = Column(String)
    planned_amount = Column(Float)
    actual_amount = Column(Float)
    execution_rate = Column(Float)

# Migratsiya
class Migration(Base):
    __tablename__ = "migrations"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String, index=True)
    country_code = Column(String)
    migrant_count = Column(Integer)
    returned_count = Column(Integer, default=0)
    migration_type = Column(String)
    flag = Column(String, default="🇺🇿")

# Bandlik
class Employment(Base):
    __tablename__ = "employments"

    id = Column(Integer, primary_key=True, index=True)
    sector = Column(String, index=True)
    planned_jobs = Column(Integer)
    actual_jobs = Column(Integer)
    execution_rate = Column(Float)

# Qurilish loyihalari
class ConstructionProject(Base):
    __tablename__ = "construction_projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contractor = Column(String)
    budget = Column(Float)
    spent_amount = Column(Float, default=0)
    progress_percent = Column(Float, default=0)
    status = Column(String, default="JARAYONDA")  # JARAYONDA, YAKUNLANGAN, KECHIKMOQDA

# Qishloq xo'jaligi (Ekinlar)
class Agriculture(Base):
    __tablename__ = "agricultures"

    id = Column(Integer, primary_key=True, index=True)
    crop_type = Column(String, index=True)
    planted_area = Column(Float)  # gektar
    expected_yield = Column(Float)  # tonna
    execution_rate = Column(Float, default=100.0)
