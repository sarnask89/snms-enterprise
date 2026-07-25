import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from app.services.mikrotik_discovery import get_discoverable_leases
from app import models

@pytest.mark.asyncio(loop_scope="function")
async def test_mikrotik_discovery_import(session):
    # 1. Setup mock service
    mock_service = MagicMock()
    
    # Simulate Mikrotik leases output (get_leases is async)
    mock_leases = [
        {
            "id": "*1",
            "address": "10.0.0.50",
            "mac-address": "AA:BB:CC:DD:EE:FF",
            "comment": "123 Kowalski Mic1",
            "status": "bound"
        }
    ]
    mock_service.get_leases = AsyncMock(return_value=mock_leases)
    
    # 2. Seed a valid NetDevice and associated IpNetwork to pass IP boundary verification
    device = models.NetDevice(
        name="Test Router",
        management_ip="127.0.0.1",
        driver_type="mikrotik_v7",
        mgmt_username="admin",
        mgmt_password_encrypted="test",
        device_type="router"
    )
    session.add(device)
    session.flush()

    network = models.IpNetwork(
        name="Test IP Network",
        cidr="10.0.0.0/24",
        net_device_id=device.id,
        active=True
    )
    session.add(network)
    session.flush()

    # 3. Call the discoverable leases function using the seeded NetDevice
    with patch("app.services.mikrotik_discovery.MikrotikService", return_value=mock_service):
        results = await get_discoverable_leases(session, device)
        
        assert len(results) == 1
        res = results[0]
        assert res["mac"] == "AA:BB:CC:DD:EE:FF"
        assert res["ip"] == "10.0.0.50"

        # Verify the parsed comment dictionary structure
        parsed = res["parsed"]
        assert parsed is not None
        assert parsed["external_id"] == "123"
        assert parsed["last_name"] == "Kowalski"
        assert parsed["street_name"] == "Adama Mickiewicza"
        assert parsed["street_number"] == "1"
        assert res["status"] == models.CustomerDeviceStatus.active
