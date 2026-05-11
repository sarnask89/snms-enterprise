import pytest
from app.models import NetNode as Node

def test_node_edit_form_has_diagnostics(admin_client, session):
    # Setup: create a test customer, device, and node
    c = models.Customer(customer_code="T-DIAG-1", first_name="Diag", last_name="User", status=models.CustomerStatus.active)
    session.add(c)
    session.flush()

    dev = models.NetDevice(name="Test Router", management_ip="192.168.1.1", device_type="router", driver_type="mikrotik_v7")
    session.add(dev)
    session.flush()

    net = models.IpNetwork(name="Test Net", cidr="10.0.0.0/24", gateway="10.0.0.1", vlan_id=100)
    session.add(net)
    session.flush()

    n = Node(
        customer_id=c.id, 
        name="TestNode", 
        hostname="TestNode", 
        ip_address="10.0.0.2", 
        mac_address="AA:BB:CC:DD:EE:FF",
        net_device_id=dev.id,
        ip_network_id=net.id,
        status=models.NetNodeStatus.active
    )
    session.add(n)
    session.commit()


    # Get the edit form
    resp = admin_client.get(f"/customer-devices/{n.id}/edit")
    assert resp.status_code == 200
    
    # Verify Network & Diagnostics card is present
    assert "Network &amp; Diagnostics" in resp.text or "Network & Diagnostics" in resp.text or "Diagnostyka" in resp.text
    
    # Verify HTMX buttons for Check, OLT Lookup, Sync
    assert f"/diagnostics/check/{n.id}" in resp.text

    assert f"/diagnostics/olt-lookup/{n.id}" in resp.text
