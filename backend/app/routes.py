from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from app.security import *
from app.schemas import *
from .models import User
from typing import List
import logging
from fastapi import Header
from .security import login_user
from passlib.context import CryptContext


logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)
router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# security = HTTPBasic()

@router.post("/login")
def login(credentials: LoginSchema):
    user = login_user(credentials)
    access_token = generate_access_token(str(user.id))
    refresh_token = generate_refresh_token(str(user.id))
    return {"access_token": access_token, "refresh_token":refresh_token,"token_type": "bearer"}

@router.post("/refresh-token")
def refresh_token(refresh_token: RefreshTokenSchema) :
    try:
        token = str(refresh_token).split("'")[1]
        payload = jwt.decode(token, 'test', algorithms=["HS256"])
        user_id = payload.get("user_id")
        logger.info('test_log',str(refresh_token))
        if user_id:
            user = User.objects(id=user_id).first()
            if user:
                access_token = generate_access_token(user_id)
                return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}

@router.get("/users", response_model=List[UserGetSchema])
def get_users():
    users = User.objects.exclude("password")
    return users

@router.post("/users")
def insert_user(user_data: UserCreateSchema):
    try:
        hashed_password = pwd_context.hash(user_data.password)
        user = User(username=user_data.username, email=user_data.email, password=hashed_password)
        user.save()
        access_token = generate_access_token(str(user.id))
        refresh_token = generate_refresh_token(str(user.id))
        return {"access_token": access_token, "refresh_token":refresh_token,"token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/users")
def update_user(user_data: UserUpdateSchema, 
                current_user: User = Depends(authenticate_user)):
    logger.error("hello",current_user.name)
    user = User.objects(id=current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user_data.name is not None:
        user.name = user_data.name
    if user_data.email is not None:
        user.email = user_data.email
    user.save()
    return {"message": "User updated successfully"}

@router.delete("/users/{user_id}")
def delete_user(user_id: str):
    user = User.objects(id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.delete()
    return {"message": "User deleted successfully"}
