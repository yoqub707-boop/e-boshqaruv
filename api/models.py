from sqlalchemy import Column, Integer, String, Boolean, Enum
import enum
from .database import Base

# Foydalanuvchi rollari
class RoleEnum(str, enum.Enum):
    MAYOR = "MAYOR"
    DEPUTY_ECONOMY = "DEPUTY_ECONOMY"
    DEPUTY_SOCIAL = "DEPUTY_SOCIAL"
    DEPUTY_CONSTRUCTION = "DEPUTY_CONSTRUCTION"
    DEPUTY_AGRICULTURE = "DEPUTY_AGRICULTURE"
    MODERATOR = "MODERATOR"

# Foydalanuvchi modeli
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(Enum(RoleEnum))
    is_active = Column(Boolean, default=True)
