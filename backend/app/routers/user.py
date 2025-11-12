from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.databases.connect import get_monitoring_db
from app.databases.monitoring.models import DBUser
from app.schemas.user import LoginResponse, LoginRequest, RegisterRequest
from app.security.hash import verify_password, hash_password
from app.security.jwt import create_access_token

user_router = APIRouter(
    prefix="/user",
    tags=["users"]
)


@user_router.post("/login")
def login(login_request: LoginRequest, db: Session = Depends(get_monitoring_db)):
    db_user = db.query(DBUser).filter(DBUser.username == login_request.username).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not verify_password(login_request.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    access_token = create_access_token(db_user.id, db_user.username, expires_delta=timedelta(minutes=20))
    return LoginResponse(access_token=access_token)


@user_router.get("/list_users")
def get_users(db: Session = Depends(get_monitoring_db)):
    return db.query(DBUser).all()


@user_router.post("/register")
def register(user_to_register: RegisterRequest, db: Session = Depends(get_monitoring_db)):
    existing_user = db.query(DBUser).filter(DBUser.username == user_to_register.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # hash לסיסמה
    hashed_pw = hash_password(user_to_register.password)

    # יצירת אובייקט User
    db_user = DBUser(
        username=user_to_register.username,
        password_hash=hashed_pw
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)  # מחזיר את המשתמש עם ID מלא
