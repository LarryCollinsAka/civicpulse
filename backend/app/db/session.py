from functools import lru_cache
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)


@lru_cache(maxsize=1)
def get_engine():
    from app.config import settings
    url = settings.database_url
    if not url:
        raise RuntimeError(
            "No database URL found. "
            "Ensure POSTGRES_URL or POSTGRES_URL_NON_POOLING is set."
        )
    return create_async_engine(
        url,
        echo=settings.app_env == "development",
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )


@lru_cache(maxsize=1)
def get_session_factory():
    return async_sessionmaker(
        bind=get_engine(),
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
        autocommit=False,
    )