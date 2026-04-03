from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Supabase / Postgres (Vercel integration variable names) ────────────
    postgres_url: str = ""              # pooled — runtime queries
    postgres_url_non_pooling: str = ""  # direct — migrations
    postgres_host: str = ""
    postgres_user: str = ""
    postgres_password: str = ""
    postgres_database: str = ""

    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_anon_key: str = ""
    supabase_jwt_secret: str = ""

    # Next.js public vars (also available server-side)
    next_public_supabase_url: str = ""
    next_public_supabase_anon_key: str = ""

    # ── Auth ───────────────────────────────────────────────────────────────
    secret_key: str = "changeme-set-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    refresh_token_expire_days: int = 30

    # ── AI ─────────────────────────────────────────────────────────────────
    anthropic_api_key: str = ""
    openai_api_key: str = ""

    # ── WhatsApp ───────────────────────────────────────────────────────────
    whatsapp_verify_token: str = ""
    whatsapp_access_token: str = ""
    whatsapp_phone_number_id: str = ""

    # ── Email ──────────────────────────────────────────────────────────────
    resend_api_key: str = ""

    # ── App ────────────────────────────────────────────────────────────────
    app_env: str = "development"
    frontend_url: str = "http://localhost:3000"

    # ── Computed properties ────────────────────────────────────────────────
    @property
    def database_url(self) -> str:
        """
        Runtime database URL for SQLAlchemy async.
        Cleans the URL to ensure compatibility with asyncpg.
        """
        url = self.postgres_url or self.postgres_url_non_pooling
        if not url:
            # Keep your existing fallback logic
            if self.postgres_host and self.postgres_user:
                url = (
                    f"postgresql+asyncpg://{self.postgres_user}:"
                    f"{self.postgres_password}@{self.postgres_host}"
                    f"/{self.postgres_database}"
                )
                return url
            return ""

        # 1. Convert to async driver prefix
        url = url.replace("postgres://", "postgresql+asyncpg://", 1) \
                 .replace("postgresql://", "postgresql+asyncpg://", 1)
        
        # 2. STRIP sslmode (This is the fix for your TypeError)
        # This removes everything after the '?' to stop the sslmode error
        if "?" in url:
            url = url.split("?")[0]
            
        return url
    @property
    def direct_database_url(self) -> str:
        """
        Direct (non-pooling) URL for migrations.
        Uses POSTGRES_URL_NON_POOLING.
        """
        url = self.postgres_url_non_pooling or self.postgres_url
        if not url:
            return ""
        return url.replace("postgres://", "postgresql+asyncpg://", 1) \
                  .replace("postgresql://", "postgresql+asyncpg://", 1)

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


settings = Settings()