import pytest
from fastapi import FastAPI, Request
from fastapi.testclient import TestClient
from app.middleware_logging import RequestLoggingMiddleware
import logging
from unittest.mock import MagicMock

def test_request_logging_middleware():
    app = FastAPI()
    app.add_middleware(RequestLoggingMiddleware)
    
    @app.get("/test-path")
    async def test_endpoint():
        return {"ok": True}

    # Mock the logger to verify it's called
    from app.middleware_logging import logger
    logger.info = MagicMock()
    
    client = TestClient(app)
    response = client.get("/test-path")
    
    assert response.status_code == 200
    
    # Verify logger was called for incoming and completed
    assert logger.info.call_count >= 2
    
    # Check if first call contains path
    args, _ = logger.info.call_args_list[0]
    assert "/test-path" in args[0]
    assert "Incoming" in args[0]
    
    # Check if second call contains status and time
    args, _ = logger.info.call_args_list[1]
    assert "Status: 200" in args[0]
    assert "Completed" in args[0]
    assert "ms" in args[0]
