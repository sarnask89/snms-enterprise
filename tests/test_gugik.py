import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.services.gugik import GugikGeocodingService

@pytest.mark.asyncio(loop_scope="function")
async def test_gugik_geocode_success():
    service = GugikGeocodingService()
    
    # Mock UUG response structure
    mock_response = {
        "results": {
            "1": {
                "x": "50.680230", # Latitude for Sandomierz
                "y": "21.749026", # Longitude
                "address": "Sandomierz, Rynek 1"
            }
        }
    }
    
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = mock_response
    mock_resp.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_resp
        
        result = await service.geocode_address("Sandomierz", "Rynek", "1")
        
        assert result is not None
        assert result["lat"] == 50.680230
        assert result["lon"] == 21.749026

@pytest.mark.asyncio(loop_scope="function")
async def test_gugik_geocode_not_found():
    service = GugikGeocodingService()
    
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {"results": {}}
    mock_resp.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_resp
        
        result = await service.geocode_address("City", "NoStreet", "0")
        assert result is None

@pytest.mark.asyncio(loop_scope="function")
async def test_gugik_geocode_pit_uke_success():
    service = GugikGeocodingService()
    
    # Mock UUG response for GetAddress/PUWG1992
    mock_text = "0\n0918123_04711_53|634567.89|489123.45"
    
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.text = mock_text

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_resp
        
        result = await service.get_coordinates_for_pit_uke("0918123", "04711", "53")
        
        assert result is not None
        assert result["X_1992"] == "634567.89"
        assert result["Y_1992"] == "489123.45"
        assert result["EPSG"] == "2180"
