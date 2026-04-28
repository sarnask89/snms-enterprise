import pytest
from unittest.mock import MagicMock, patch
from app.services.mikrotik_discovery import get_discoverable_leases
from app import models

@pytest.mark.asyncio(loop_scope="function")
async def test_mikrotik_discovery_import(session):
    # 1. Setup mock service
    mock_service = MagicMock()
    
    # Simulate Mikrotik leases output
    mock_leases = [
        {
            "id": "*1",
            "address": "10.0.0.50",
            "mac-address": "AA:BB:CC:DD:EE:FF",
            "comment": "123 Kowalski Mic1",
            "status": "bound"
        }
    ]
    mock_service.get_leases = MagicMock(return_value=mock_leases)
    
    # 2. Setup DB context (City ID 1 is seeded in conftest)
    # We need to make sure the mock returns what the function expects
    with patch("app.services.mikrotik_discovery.MikrotikService", return_value=mock_service):
        results = await get_discoverable_leases(session, "127.0.0.1")
        
        assert len(results) == 1
        res = results[0]
        assert res["external_id"] == "123"
        assert res["last_name"] == "Kowalski"
        assert res["street_name"] == "Adama Mickiewicza"
        assert res["street_number"] == "1"
        assert res["status_mapped"] == models.NodeStatus.active
