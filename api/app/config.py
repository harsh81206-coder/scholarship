"""app/config.py — pydantic-settings config."""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:///./vps.db"
    jwt_secret: str = "change-me-dev-secret-key-32chars"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 720
    adapter_mode: str = "mock"
    demo_otp: str = "123456"
    cors_origins: str = "http://localhost:3000"
    data_dir: str = "./data"
    anthropic_api_key: str = ""
    log_level: str = "INFO"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


@lru_cache
def get_settings() -> Settings:
    return Settings()
