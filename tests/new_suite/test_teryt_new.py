import pytest
from app import models

def test_teryt_browse_access(admin_client):
    resp = admin_client.get("/teryt/browse")
    assert resp.status_code == 200
    assert "TERYT" in resp.text

def test_teryt_cities_list(admin_client):
    resp = admin_client.get("/teryt/cities")
    assert resp.status_code == 200
    assert "Miejscowości" in resp.text

def test_teryt_ws_check(admin_client):
    resp = admin_client.get("/teryt/ws/check")
    assert resp.status_code == 200
    assert "ok" in resp.json()

def test_teryt_api_suggest(client, session):
    # Setup: need a city
    state = models.LocationState(name="API-State", teryt_code="88")
    dist = models.LocationDistrict(name="API-Dist", state=state)
    city = models.LocationCity(name="API-City", district=dist)
    session.add_all([state, dist, city])
    session.commit()

    resp = client.get("/teryt/api/suggest", params={"q": "API-City", "kind": "city"})
    assert resp.status_code == 200
    assert "API-City" in resp.text
