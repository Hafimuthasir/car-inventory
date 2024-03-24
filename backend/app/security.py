from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials,OAuth2PasswordBearer
from .models import User
import jwt
from jwt import PyJWTError
from typing import Callable
import logging
from passlib.context import CryptContext
from datetime import datetime,timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


security = HTTPBasic()
JWT_SECRET = "test"
ACCESS_TOKEN_EXPIRATION = timedelta(minutes=1) 
REFRESH_TOKEN_EXPIRATION = timedelta(days=30)

def generate_access_token(user_id: str) -> str:
    expiration_time = datetime.utcnow() + ACCESS_TOKEN_EXPIRATION
    payload = {
        "user_id": user_id,
        "exp": expiration_time  # Set the expiration time in the payload
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token

def generate_refresh_token(user_id: str) -> str:
    expiration_time = datetime.utcnow() + REFRESH_TOKEN_EXPIRATION
    payload = {
        "user_id": user_id,
        "exp": expiration_time  # Set the expiration time in the payload
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token

def login_user(credentials: HTTPBasicCredentials = Depends(security)):
    user = User.objects(username=credentials.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    if not pwd_context.verify(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return user


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def authenticate_user(token: str = Depends(oauth2_scheme)):
    try:
        logger.error("hello")
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid JWT token"
            )
        user = User.objects(id=user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        return user
    
    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid JWT token"
        )