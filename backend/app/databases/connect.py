from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings


def get_monitoring_db():
    db_url = get_settings().monitoring_db_url
    engine = create_engine(db_url)
    session_maker = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session_local = session_maker()
    db = session_local
    try:
        yield db
    finally:
        db.close()
