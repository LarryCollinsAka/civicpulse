from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.auth import OAuthCallbackRequest

from app.dependencies.auth import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
    require_super_admin,
)
from app.dependencies.db import get_db
from app.models.user import User, UserRole
from app.schemas.auth import (
    LoginRequest,
    MessageResponse,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserRead,
)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ── POST /api/auth/register ────────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db), current_admin: User = Depends(require_super_admin)):
    
    # Only an existing Super Admin can now register new users.
    # Check email not already taken
    existing = await db.execute(
        select(User).where(User.email == payload.email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        role=payload.role,
        preferred_language=payload.preferred_language,
    )
    db.add(user)
    await db.flush()  # get the generated ID without committing

    access_token  = create_access_token(user.id, user.role, user.city_id)
    refresh_token = create_refresh_token(user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserRead.model_validate(user),
    )


# ── POST /api/auth/login ───────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where(User.email == payload.email)
    )
    user = result.scalar_one_or_none()

    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token  = create_access_token(user.id, user.role, user.city_id)
    refresh_token = create_refresh_token(user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserRead.model_validate(user),
    )


# ── POST /api/auth/refresh ─────────────────────────────────────────────────

@router.post("/refresh", response_model=TokenResponse)
async def refresh(payload: RefreshRequest, db: AsyncSession = Depends(get_db)):
    token_data = decode_token(payload.refresh_token)

    if token_data.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )

    from uuid import UUID
    result = await db.execute(
        select(User).where(User.id == UUID(token_data["sub"]))
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    access_token  = create_access_token(user.id, user.role, user.city_id)
    refresh_token = create_refresh_token(user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserRead.model_validate(user),
    )


# ── GET /api/auth/me ───────────────────────────────────────────────────────

@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)):
    return UserRead.model_validate(current_user)


# ── POST /api/auth/logout ──────────────────────────────────────────────────

@router.post("/logout", response_model=MessageResponse)
async def logout():
    # JWT is stateless — client discards the token
    # Token blacklisting can be added later via Redis
    return MessageResponse(message="Logged out successfully")


@router.post("/oauth/callback", response_model=TokenResponse)
async def oauth_callback(
    payload: OAuthCallbackRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Exchange a Supabase access token for a CivicPulse JWT.
    Called after Google, Facebook, or Phone OTP login.
    """
    from app.config import settings
    from supabase import create_client

    # Verify the Supabase token and get user info
    supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)
    supabase_user = supabase.auth.get_user(payload.supabase_access_token)

    if not supabase_user or not supabase_user.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Supabase token",
        )

    sb_user = supabase_user.user
    email   = sb_user.email
    phone   = payload.phone or (sb_user.phone if hasattr(sb_user, "phone") else None)

    # Find or create user
    query = select(User).where(
        (User.email == email) if email else (User.phone == phone)
    )
    result = await db.execute(query)
    user   = result.scalar_one_or_none()

    if not user:
        # First OAuth login — create citizen account
        user = User(
            email=email,
            phone=phone,
            full_name=sb_user.user_metadata.get("full_name") or
                      sb_user.user_metadata.get("name") or
                      email,
            role=UserRole.citizen,
            is_verified=True,
            preferred_language="fr",
        )
        db.add(user)
        await db.flush()

    access_token  = create_access_token(user.id, user.role, user.city_id)
    refresh_token = create_refresh_token(user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserRead.model_validate(user),
    )