from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

class Settings(BaseSettings):
    # App
    CRM_ENV: str = "development"
    APP_DISPLAY_NAME: str = "SNMS Enterprise"
    
    # DB
    DATABASE_URL: str = "sqlite:///./crm.sqlite"
    
    # Auth & Security
    CRM_SECRET_KEY: str = Field(..., env="CRM_SECRET_KEY")
    CRM_ENCRYPTION_KEY: str = Field(..., env="CRM_ENCRYPTION_KEY")
    CRM_ADMIN_USER: str = "admin"
    CRM_ADMIN_PASSWORD: str = Field(..., env="CRM_ADMIN_PASSWORD")
    AUTH_ENABLED: bool = True
    
    # Uploads
    CRM_UPLOAD_ROOT: Path = Path("./uploads")
    CRM_MAX_UPLOAD_MB: float = 20.0
    
    # TERYT
    TERYT_WS_WSDL: str = "https://uslugaterytws1.stat.gov.pl/wsdl/terytws1.wsdl"
    TERYT_WS_USER: str = ""
    TERYT_WS_PASSWORD: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra='ignore')

settings = Settings()
