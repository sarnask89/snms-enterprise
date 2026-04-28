import pytest
from unittest.mock import patch, MagicMock
from app import models
from tests.mocks.mikrotik_service import MockMikrotikService

@pytest.mark.integration
def test_node_check_diagnostics_mocked(admin_client, session):
    """Test the 'Sprawdź' tool by mocking the hardware service."""
    # 1. Setup data
    c = models.Customer(first_name="Diag", last_name="Tester", customer_code="D-01")
    session.add(c)
    session.flush()
    
    dev = models.NetDevice(
        name="Mock-Router", 
        management_ip="1.1.1.1", 
        driver_type="mikrotik_v7"
    )
    session.add(dev)
    session.flush()
    
    n = models.Node(
        customer_id=c.id,
        name="Test-Node",
        hostname="test-node-host",
        ip_address="10.0.0.50",
        mac_address="AA:BB:CC:DD:EE:FF",
        net_device_id=dev.id,
        status=models.NodeStatus.active
    )
    session.add(n)
    session.commit()

    # 2. Patch MikrotikService in the router module
    # We want any instantiation of MikrotikService in app.routers.diagnostics to return our mock
    with patch("app.routers.diagnostics.MikrotikService") as mock_class:
        # Configure the mock instance
        mock_instance = MockMikrotikService()
        mock_class.return_value = mock_instance
        
        # 3. Call endpoint
        resp = admin_client.post(f"/diagnostics/check/{n.id}", headers={"HX-Request": "true"})
        
        assert resp.status_code == 200
        # Verify mock data appears in the HTML response
        assert "bound" in resp.text
        assert "1h20m" in resp.text
        assert "100us" in resp.text
        assert "bridge1" in resp.text
        assert "ether1" in resp.text
