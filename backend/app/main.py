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