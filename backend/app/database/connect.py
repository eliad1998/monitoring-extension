from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .connect import get_db_settings


def get_db():
    db_settings = get_db_settings()
    engine = create_engine(db_settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
