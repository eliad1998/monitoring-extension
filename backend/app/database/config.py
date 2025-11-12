from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class DBSettings(BaseSettings):
    DATABASE_URL: str 

    model_config = SettingsConfigDict(
        env_file='.env', 
        env_file_encoding='utf-8'
    )

@lru_cache
def get_db_settings():
    return DBSettings()
