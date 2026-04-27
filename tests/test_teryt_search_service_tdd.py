import pytest
from app.teryt_ws import wyszukaj_miejscowosc, wyszukaj_ulice

@pytest.mark.asyncio
def test_teryt_ws_search_cities_failing():
    # This should fail if we haven't implemented a proper wrapper or if credentials missing
    # But here I want to test the LOGIC of a new service that will be created
    pass


def test_teryt_search_service_placeholder():
    # We will create TerytSearchService in app/teryt_ws.py or a new file
    from app.teryt_ws import TerytSearchService
    service = TerytSearchService()
    
    # Requirement: search buildings for a given street and city
    results = service.search_buildings(city_name="Sandomierz", street_name="Lwowska")
    assert isinstance(results, list)
    assert "1" in results


def test_teryt_router_building_suggest(admin_client):
    resp = admin_client.get("/teryt/api/suggest", params={"kind": "building", "city_name": "Sandomierz", "street_name": "Lwowska"})
    assert resp.status_code == 200
    assert "building" in resp.text
    assert "1" in resp.text

def test_customer_new_form_renders(admin_client):
    resp = admin_client.get("/customers/new")
    assert resp.status_code == 200
    assert "Miejscowość" in resp.text
    assert "Ulica" in resp.text
    assert "Nr budynku" in resp.text
    assert "teryt-lookup-container" in resp.text
