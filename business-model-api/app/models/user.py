from sqlalchemy import Column, String, DateTime, Integer, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    avatar_url = Column(Text, nullable=True)
    plan = Column(String(20), nullable=False, default="free")  # free, pro, enterprise
    auth_provider = Column(String(50), default="email")  # email, google, linkedin
    role = Column(String(20), default="user")  # user, admin
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    usage = relationship("UserUsage", back_populates="user", uselist=False)
    ideas = relationship("Idea", back_populates="user")

class UserUsage(Base):
    __tablename__ = "user_usage"

    user_id = Column(String, ForeignKey("users.id"), primary_key=True, index=True)
    month = Column(DateTime, nullable=True)  # NULL for global snapshot
    ideas_active = Column(Integer, nullable=False, default=0)
    models_generated_month = Column(Integer, nullable=False, default=0)
    ai_messages_month = Column(Integer, nullable=False, default=0)
    ideas_limit = Column(Integer, nullable=False, default=3)
    models_limit_month = Column(Integer, nullable=False, default=6)
    ai_messages_limit_month = Column(Integer, nullable=False, default=50)

    # Relationships
    user = relationship("User", back_populates="usage")