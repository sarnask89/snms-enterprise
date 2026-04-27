import pytest
from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient
from app.errors import setup_error_handlers
from sqlalchemy.exc import SQLAlchemyError

def test_error_handlers():
    app = FastAPI()
    setup_error_handlers(app)
    
    @app.get("/trigger-404")
    async def trigger_404():
        raise HTTPException(status_code=404, detail="Not Found")
        
    @app.get("/trigger-500")
    async def trigger_500():
        raise Exception("Unhandled")

    @app.get("/trigger-db")
    async def trigger_db():
        raise SQLAlchemyError("DB Fail")

    client = TestClient(app, raise_server_exceptions=False)
    
    # Test 404
    resp = client.get("/trigger-404")
    assert resp.status_code == 404
    assert "Nie znaleziono strony" in resp.text
    
    # Test 500
    resp = client.get("/trigger-500")
    assert resp.status_code == 500
    assert "Błąd serwera" in resp.text

    # Test DB
    resp = client.get("/trigger-db")
    assert resp.status_code == 500
    assert "Błąd bazy danych" in resp.text

def test_htmx_error_handling():
    app = FastAPI()
    setup_error_handlers(app)
    
    @app.get("/trigger-htmx")
    async def trigger_htmx():
        raise HTTPException(status_code=400, detail="HTMX Error")
        
    client = TestClient(app)
    
    # Test HTMX request
    resp = client.get("/trigger-htmx", headers={"hx-request": "true"})
    assert resp.status_code == 400
    assert "Błąd!" in resp.text
    assert "HTMX Error" in resp.text
    # Should be a fragment, not a full page
    assert "<html>" not in resp.text
