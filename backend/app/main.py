from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth

app = FastAPI(
    title="CivicPulse API",
    version="1.0.0",
    description="Smart city incident reporting platform API",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "https://civicpulse-gray.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])


@app.get("/api/health", tags=["health"])
async def health():
    return {"status": "ok", "version": "1.0.0"}


@app.get("/api/debug/env", tags=["debug"])
async def debug_env():
    """
    Temporary endpoint to verify env vars are loading.
    Remove before going fully live.
    """
    return {
        "postgres_url_set":             bool(settings.postgres_url),
        "postgres_url_non_pooling_set": bool(settings.postgres_url_non_pooling),
        "postgres_host_set":            bool(settings.postgres_host),
        "supabase_url_set":             bool(settings.supabase_url),
        "supabase_service_role_set":    bool(settings.supabase_service_role_key),
        "secret_key_set":               bool(settings.secret_key),
        "database_url_computed":        settings.database_url[:30] + "..."
                                        if settings.database_url else "EMPTY",
        "app_env":                      settings.app_env,
    }