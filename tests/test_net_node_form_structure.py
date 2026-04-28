import pytest
from bs4 import BeautifulSoup
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db, SessionLocal
from app import models

from app.deps import verify_session

@pytest.fixture
def client():
    # Bypass authentication for testing UI structure
    app.dependency_overrides[verify_session] = lambda: True
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_net_node_form_fields(client):
    """Verify that the net node form has all required fields with correct names."""
    resp = client.get("/net-nodes/new")
    assert resp.status_code == 200
    
    soup = BeautifulSoup(resp.text, "html.parser")
    form = soup.find("form")
    assert form is not None
    
    # Required fields based on backend
    expected_fields = [
        "name",
        "division_id",
        "location_city_id",
        "location_street_id",
        "street_number",
        "latitude",
        "longitude",
        "node_type",
        "owner_type",
        "has_power",
        "has_env_control"
    ]
    
    for field_name in expected_fields:
        input_el = soup.find(attrs={"name": field_name})
        assert input_el is not None, f"Field '{field_name}' not found in form"
        
        # Specific check for location_street_id to ensure it's a hidden field
        if field_name == "location_street_id":
            assert input_el.get("type") == "hidden"
