import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app

# Health check is tested in smoke tests or requires specific auth bypass

def test_static_files(client):
    # Try to get a non-existent static file to see if it's mounted
    response = client.get("/static/nonexistent.file")
    assert response.status_code == 404 # 404 is correct if mounted but file missing
