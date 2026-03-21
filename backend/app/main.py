from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, incidents, ai, cities, users, reports, webhooks

app = FastAPI(title="CivicPulse API", version="1.0.0")

app.add_middleware(CORSMiddleware,
    allow_origins=["https://civicpulse.vercel.app"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router,      prefix="/api/auth",      tags=["auth"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["incidents"])
app.include_router(ai.router,        prefix="/api/ai",        tags=["ai"])
app.include_router(cities.router,    prefix="/api/cities",    tags=["cities"])
app.include_router(users.router,     prefix="/api/users",     tags=["users"])
app.include_router(reports.router,   prefix="/api/reports",   tags=["reports"])
app.include_router(webhooks.router,  prefix="/api/webhooks",  tags=["webhooks"])