import logging
from fastapi import Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from app.templating import render

logger = logging.getLogger("app.errors")

async def global_exception_handler(request: Request, exc: Exception):
    """Fallback handler for any unhandled exception."""
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    
    if _is_htmx(request):
        return _render_htmx_error("Wystąpił nieoczekiwany błąd serwera.")
        
    return render(request, "errors/500.html", {"detail": "Błąd serwera"}, status_code=500)

async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """Handler for database errors."""
    logger.error(f"Database Error: {str(exc)}", exc_info=True)
    
    if _is_htmx(request):
        return _render_htmx_error("Błąd bazy danych. Spróbuj ponownie później.")
        
    return render(request, "errors/db_error.html", {"detail": str(exc)}, status_code=500)

async def http_exception_handler(request: Request, exc: HTTPException):
    """Handler for FastAPI HTTPExceptions."""
    logger.warning(f"HTTP {exc.status_code}: {exc.detail}")
    
    if _is_htmx(request):
        return _render_htmx_error(exc.detail, status_code=exc.status_code)
        
    template = "errors/404.html" if exc.status_code == 404 else "errors/error.html"
    return render(request, template, {"detail": exc.detail, "status_code": exc.status_code}, status_code=exc.status_code)

def _is_htmx(request: Request) -> bool:
    """Check if request is from HTMX."""
    return request.headers.get("hx-request") == "true"

def _render_htmx_error(message: str, status_code: int = 200):
    """Renders a small error fragment for HTMX."""
    # We use 200 so HTMX actually swaps the content, but we could also use 
    # custom headers like HX-Retarget to show it in a specific place.
    html = f'<div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200" role="alert">' \
           f'<span class="font-bold">Błąd!</span> {message}' \
           f'</div>'
    return HTMLResponse(content=html, status_code=status_code)

def setup_error_handlers(app):
    """Registers all exception handlers to the FastAPI app."""
    app.add_exception_handler(Exception, global_exception_handler)
    app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
