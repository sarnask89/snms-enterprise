import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("app.middleware")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log request details and execution time."""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Get user info from state if available (from PortalUserMiddleware)
        user = getattr(request.state, "portal_user", None)
        user_str = f"User: {user.username}" if user else "User: Anonymous"
        
        # Log request
        logger.info(f"Incoming: {request.method} {request.url.path} ({user_str})")
        
        try:
            response = await call_next(request)
            
            process_time = (time.time() - start_time) * 1000
            logger.info(
                f"Completed: {request.method} {request.url.path} "
                f"Status: {response.status_code} "
                f"Time: {process_time:.2f}ms"
            )
            return response
            
        except Exception as e:
            # Log the exception before re-raising it
            # This is critical for visibility even if global handler catches it
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"Failed: {request.method} {request.url.path} "
                f"Error: {str(e)} "
                f"Time: {process_time:.2f}ms",
                exc_info=True
            )
            raise
