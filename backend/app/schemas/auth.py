from pydantic import BaseModel, EmailStr, field_validator
from uuid import UUID
from app.models.user import UserRole


# ── Request schemas ────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.citizen
    preferred_language: str = "fr"

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


# ── Response schemas ───────────────────────────────────────────────────────

class UserRead(BaseModel):
    id: UUID
    email: str | None
    phone: str | None
    full_name: str | None
    role: UserRole
    city_id: UUID | None
    preferred_language: str
    is_verified: bool

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead


class MessageResponse(BaseModel):
    message: str

class OAuthCallbackRequest(BaseModel):
    supabase_access_token: str
    provider: str = "email"
    phone: str | None = None    