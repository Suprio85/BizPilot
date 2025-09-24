from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Usage-related schemas
class UsageSnapshot(BaseModel):
    ideas_active: int
    ideas_limit: int
    models_generated_month: int
    models_limit_month: int
    ai_messages_month: int
    ai_messages_limit_month: int

    class Config:
        from_attributes = True

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: Optional[str] = "user"
    auth_provider: Optional[str] = "email"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    avatar_url: Optional[str] = None
    plan: str
    usage: UsageSnapshot
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Auth response for signup/login
class AuthResponse(BaseModel):
    token: str
    user: UserResponse