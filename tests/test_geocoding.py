import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.services.geocoding import GeocodingService

@pytest.mark.asyncio
async def test_geocode_address_success():
    service = GeocodingService()
    
    # Mock response object
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = [
        {
            "lat": "50.680230",
            "lon": "21.749026",
            "display_name": "ul. Opatowska 5, Sandomierz, Polska"
        }
    ]
    mock_resp.raise_for_status = MagicMock()

    # Mock AsyncClient and the 'get' method
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_resp
        
        result = await service.geocode_address("Sandomierz", "Opatowska", "5")
        
        assert result is not None
        assert result["lat"] == 50.680230
        assert result["lon"] == 21.749026

@pytest.mark.asyncio
async def test_geocode_address_not_found():
    service = GeocodingService()
    
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = []
    mock_resp.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_resp
        
        result = await service.geocode_address("City", "NonExistentStreet", "999")
        assert result is None

@pytest.mark.asyncio
async def test_geocode_address_error():
    service = GeocodingService()
    
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.side_effect = Exception("Network timeout")
        
        result = await service.geocode_address("Sandomierz", "Opatowska", "5")
        assert result is None

@pytest.mark.asyncio
async def test_geocode_address_missing_params():
    service = GeocodingService()
    assert await service.geocode_address("", "Street", "1") is None
    assert await service.geocode_address("City", "", "1") is None
    assert await service.geocode_address("City", "Street", "") is None
    assert await service.geocode_address(None, None, None) is None
