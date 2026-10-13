import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Evifacto AI - Venture Intelligence Engine"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    PORT: int = int(os.getenv("PORT", 8000))
    HOST: str = "0.0.0.0"
    REPORTS_FILE_PATH: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "reports.json")

    class Config:
        case_sensitive = True

settings = Settings()
