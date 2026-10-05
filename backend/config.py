from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    groq_api_key: str
    chroma_persist_dir: str = "./chroma_db"
    environment: str = "development"
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"
    max_file_size_mb: int = 10

    # Groq model names
    vision_model: str = "llama-3.2-11b-vision-preview"   # for image analysis
    text_model: str = "llama-3.3-70b-versatile"          # for text-only compliance

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
