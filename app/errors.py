import logging
from fastapi import Request, HTTPException
from fastapi.responses import HTMLResponse
from sqlalchemy.exc import SQLAlchemyError
from app.templating import render

logger = logging.getLogger("app.errors")

async def global_exception_handler(request: Request, exc: Exception):
    """Fallback handler for any unhandled exception."""
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    
    if _is_htmx(request):
        return _render_htmx_error(f"Serwer zwrócił błąd: {str(exc)}")
    
    user = getattr(request.state, "portal_user", None)
    try:
        return render(request, "errors/500.html", {"detail": str(exc), "portal_user": user}, status_code=500)
    except Exception as e:
        logger.error(f"Double fault in 500 handler: {str(e)}")
        return HTMLResponse("<h1>500 Internal Server Error</h1>", status_code=500)

async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """Handler for database errors."""
    logger.error(f"Database Error: {str(exc)}", exc_info=True)
    
    if _is_htmx(request):
        return _render_htmx_error("Błąd bazy danych. Spróbuj ponownie później.")
    
    user = getattr(request.state, "portal_user", None)
    try:
        return render(request, "errors/error.html", {"detail": "Błąd bazy danych", "status_code": 500, "portal_user": user}, status_code=500)
    except Exception:
        return HTMLResponse("<h1>Database Error</h1>", status_code=500)

async def http_exception_handler(request: Request, exc: HTTPException):
    """Handler for FastAPI HTTPExceptions."""
    if 300 <= exc.status_code < 400:
        from fastapi.responses import RedirectResponse
        return RedirectResponse(url=exc.headers.get("Location", "/"), status_code=exc.status_code)
        
    logger.warning(f"HTTP {exc.status_code}: {exc.detail}")
    
    if _is_htmx(request):
        return _render_htmx_error(exc.detail, status_code=exc.status_code)
        
    template = "errors/404.html" if exc.status_code == 404 else "errors/error.html"
    user = getattr(request.state, "portal_user", None)
    try:
        return render(request, template, {"detail": exc.detail, "status_code": exc.status_code, "portal_user": user}, status_code=exc.status_code)
    except Exception:
        return HTMLResponse(f"<h1>Error {exc.status_code}</h1><p>{exc.detail}</p>", status_code=exc.status_code)

def _is_htmx(request: Request) -> bool:
    """Check if request is from HTMX."""
    return request.headers.get("hx-request") == "true"

def _render_htmx_error(message: str, status_code: int = 200):
    """Renders a small error fragment for HTMX."""
    html = f'<div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200" role="alert">' \
           f'<span class="font-bold">Błąd!</span> {message}' \
           f'</div>'
    return HTMLResponse(content=html, status_code=status_code)

def setup_error_handlers(app):
    """Registers all exception handlers to the FastAPI app."""
    app.add_exception_handler(Exception, global_exception_handler)
    app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
