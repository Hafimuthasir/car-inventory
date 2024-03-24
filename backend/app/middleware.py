from fastapi import Request, Response
import logging

logger = logging.getLogger(__name__)

async def log_request(request: Request, call_next):
    # logger.info(f"Received request: {request.method} {request.url}")
    logger.info(f"Received request: ")
    # logger.info("Request Headers:")
    # for name, value in request.headers.items():
    #     logger.info(f"{name}: {value}")

    body = await request.body()
    if body:
        logger.info(f"Request Body: {body.decode()}")

    response = await call_next(request)

    return response


security_headers = {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains", 
    "X-Content-Type-Options": "nosniff", 
    "X-Frame-Options": "DENY", 
    "X-XSS-Protection": "1; mode=block",  
    "Content-Security-Policy": "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline';" 
}

async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    for header, value in security_headers.items():
        response.headers[header] = value
    return response