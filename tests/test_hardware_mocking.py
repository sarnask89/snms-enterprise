import pytest
from tests.mocks.mikrotik_service import MockMikrotikService

@pytest.mark.asyncio(loop_scope="function")
async def test_diagnostic_tool_with_mock():
    """Verify that the diagnostic logic works correctly with a mock service."""
    mock_service = MockMikrotikService()
    
    # 1. Test Ping
    ping_res = await mock_service.remote_ping("10.0.0.50")
    assert len(ping_res) == 2
    assert ping_res[0]["status"] == "UP"
    
    # 2. Test Lease Info
    lease = await mock_service.get_lease_info("AA:BB:CC:DD:EE:FF")
    assert lease["status"] == "bound"
    assert lease["address"] == "10.0.0.50"

    # 3. Test Bridge Info
    bridge = await mock_service.get_bridge_host_info("AA:BB:CC:DD:EE:FF")
    assert len(bridge) == 1
    assert bridge[0]["interface"] == "ether1"

@pytest.mark.asyncio(loop_scope="function")
async def test_mock_get_leases():
    """Verify mock leases data."""
    mock_service = MockMikrotikService()
    leases = await mock_service.get_leases()
    assert len(leases) == 1
    assert leases[0]["comment"] == "100 Kowalski Mic1"
