from pydantic import BaseModel

# schema של בקשת login
class LoginRequest(BaseModel):
    username: str
    password: str

# schema של תגובה
class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegisterRequest(BaseModel):
    username: str
    password: str
