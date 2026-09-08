from functools import lru_cache
from pathlib import Path
from typing import Annotated

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Woofy API"
    app_env: str = "development"
    secret_key: str = "development-only-change-this-secret-key"
    database_url: str = "sqlite:///./data/woofy.db"
    frontend_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
        ]
    )
    access_token_expire_minutes: int = 60 * 24 * 7
    openai_api_key: str = ""
    openai_model: str = "gpt-5.6-luna"
    google_client_id: str = ""
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""
    public_url: str = "http://localhost:5173"
    static_dir: str = "frontend/dist"
    cookie_secure: bool = False
    cookie_samesite: str = "lax"
    chat_daily_limit: int = 40

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @field_validator("frontend_origins", mode="before")
    @classmethod
    def split_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"

    def validate_production(self) -> None:
        if self.is_production:
            if len(self.secret_key) < 32 or self.secret_key.startswith(("development-", "troque-")):
                raise RuntimeError("Defina SECRET_KEY aleatória com pelo menos 32 caracteres.")
            if not self.cookie_secure or any(
                not origin.startswith("https://") for origin in self.frontend_origins
            ):
                raise RuntimeError("Produção exige COOKIE_SECURE=true e origens HTTPS.")
        if self.cookie_samesite not in {"lax", "strict", "none"}:
            raise RuntimeError("COOKIE_SAMESITE inválido.")


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    if settings.database_url.startswith("sqlite:///"):
        raw_path = settings.database_url.removeprefix("sqlite:///")
        if raw_path and raw_path != ":memory:":
            Path(raw_path).parent.mkdir(parents=True, exist_ok=True)
    settings.validate_production()
    return settings
