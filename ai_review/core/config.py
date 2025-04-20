import os
from pathlib import Path
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseSettings, Field, validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables with defaults."""
    
    # API Settings
    API_PORT: int = Field(default=8000, env="PORT")
    API_HOST: str = Field(default="0.0.0.0", env="HOST")
    DEBUG: bool = Field(default=False)
    
    # Database
    DATABASE_URL: str = Field(default="postgresql://postgres:postgres@localhost:5432/ai_review")
    REDIS_URL: Optional[str] = Field(default=None)
    
    # LLM Settings
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = Field(default="gpt-4")
    
    # Security
    SECRET_KEY: str = Field(default="")
    ALLOWED_ORIGINS: List[str] = Field(default_factory=list)
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO")
    LOG_FILE: Optional[str] = Field(default=None)
    
    @validator("ALLOWED_ORIGINS", pre=True)
    def parse_allowed_origins(cls, v: Any) -> List[str]:
        """Parse ALLOWED_ORIGINS from comma-separated string if needed."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    
    @validator("SECRET_KEY", pre=True)
    def validate_secret_key(cls, v: str) -> str:
        """Validate SECRET_KEY or generate a random one."""
        if not v:
            import secrets
            return secrets.token_hex(32)
        return v
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


def get_settings() -> Settings:
    """Get application settings, loading from .env file if present."""
    env_path = Path(".env")
    
    # Try to load .env from project root if not found in current directory
    if not env_path.exists():
        parent_env = Path(__file__).parent.parent.parent / ".env"
        if parent_env.exists():
            env_path = parent_env
    
    return Settings(_env_file=env_path if env_path.exists() else None)


settings = get_settings() 