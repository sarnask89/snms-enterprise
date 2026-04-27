import pytest
from app import models

def test_manage_addresses_access(admin_client):
    resp = admin_client.get("/admin/addresses")
    assert resp.status_code == 200
    assert "Zarządzanie" in resp.text

def test_set_default_city(admin_client, session):
    # Setup: need a city
    state = models.LocationState(name="TestState", teryt_code="99")
    dist = models.LocationDistrict(name="TestDist", state=state)
    city = models.LocationCity(name="TestCity", district=dist, is_managed=True)
    session.add_all([state, dist, city])
    session.commit()

    resp = admin_client.post(f"/admin/addresses/city/{city.id}/set-default", follow_redirects=False)
    assert resp.status_code == 303
    
    session.refresh(city)
    assert city.is_default is True

def test_toggle_managed_city(admin_client, session):
    state = models.LocationState(name="T2", teryt_code="98")
    dist = models.LocationDistrict(name="D2", state=state)
    city = models.LocationCity(name="C2", district=dist, is_managed=False)
    session.add_all([state, dist, city])
    session.commit()

    resp = admin_client.post(f"/admin/addresses/city/{city.id}/toggle-managed", follow_redirects=False)
    assert resp.status_code == 303
    session.refresh(city)
    assert city.is_managed is True

def test_teryt_search_results(admin_client, session):
    # Setup: need a city
    state = models.LocationState(name="S3", teryt_code="97")
    dist = models.LocationDistrict(name="D3", state=state)
    city = models.LocationCity(name="SearchCity", district=dist)
    session.add_all([state, dist, city])
    session.commit()

    resp = admin_client.get("/admin/addresses/search-teryt", params={"q": "Search"})
    assert resp.status_code == 200
    assert "SearchCity" in resp.text
