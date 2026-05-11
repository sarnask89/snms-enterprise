import pytest
from app.utils.string_utils import normalize_polish_chars, generate_login, generate_password
from app.routers.network_discovery import _find_ip_network
from app import models
import ipaddress

def test_normalize_polish_chars():
    assert normalize_polish_chars("żółć") == "zolc"
    assert normalize_polish_chars("ĄĘĆŁŃÓŚŹŻ") == "AECLNOSZZ"
    assert normalize_polish_chars("Miejscowość") == "Miejscowosc"
    assert normalize_polish_chars("") == ""

def test_generate_login():
    # Example from USER request: Kwiatkowski, Gen Lina Żółkiewskiego 9, ap 10
    login = generate_login("Kwiatkowski", "Gen Lina Żółkiewskiego", "9", "10")
    assert login == "kwiatkowski9zol10"
    
    # Simple case
    login = generate_login("Nowak", "Leśna", "1", "")
    assert login == "nowak1les"
    
    # Missing data
    login = generate_login("Kowalski", "", "", "")
    assert login == "kowalski"

def test_generate_password():
    p1 = generate_password(10)
    p2 = generate_password(10)
    assert len(p1) == 10
    assert p1 != p2
    # Check if contains characters from our allowed set
    allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    for char in p1:
        assert char in allowed

def test_find_ip_network():
    # (net_obj, id, device_id)
    net_cache = [
        (ipaddress.ip_network("192.168.1.0/24"), 1, 10),
        (ipaddress.ip_network("10.0.0.0/8"), 2, 10),
        (ipaddress.ip_network("172.16.0.0/12"), 3, 20),
    ]
    
    # Exact match on device
    assert _find_ip_network("192.168.1.5", 10, net_cache) == 1
    # Match on device (different network)
    assert _find_ip_network("10.5.5.5", 10, net_cache) == 2
    # Fallback to other device's network
    assert _find_ip_network("172.16.0.1", 10, net_cache) == 3
    # No match
    assert _find_ip_network("8.8.8.8", 10, net_cache) is None
    # Invalid IP
    assert _find_ip_network("not-an-ip", 10, net_cache) is None

def test_batch_generate_access_api(admin_client, session):
    from sqlalchemy import select
    from app import models
    
    # 1. Setup test data
    city = session.scalars(select(models.LocationCity).limit(1)).first()
    street = session.scalars(select(models.LocationStreet).limit(1)).first()
    
    customer = models.Customer(
        customer_code="TEST-GEN",
        first_name="Jan",
        last_name="Testowy",
        location_city_id=city.id,
        location_street_id=street.id,
        street_number="5",
        apartment_number="2"
    )
    session.add(customer)
    session.flush()
    
    device = models.CustomerDevice(
        customer_id=customer.id,
        hostname="test-node",
        ip_address="1.1.1.1",
        mac_address="AA:BB:CC:DD:EE:FF"
    )
    session.add(device)
    session.commit()
    
    # Verify no login/pass yet
    assert device.login is None
    assert device.passwd is None
    
    # 2. Call batch generate
    resp = admin_client.post("/customers/batch-generate-access")
    assert resp.status_code == 200
    assert "Wygenerowano" in resp.text
    
    # 3. Verify in DB
    session.refresh(device)
    assert device.login is not None
    assert device.passwd is not None
    assert "testowy5" in device.login # Should contain normalized surname and street number

def test_helpdesk_ticket_flow(admin_client, session):
    from app import models
    from sqlalchemy import select
    
    # 1. Ensure queue and customer exist
    queue = session.scalars(select(models.HelpdeskQueue).where(models.HelpdeskQueue.name == "default")).first()
    if not queue:
        queue = models.HelpdeskQueue(name="default", description="Domyślna kolejka")
        session.add(queue)
        session.commit()
    
    customer = session.scalars(select(models.Customer)).first()
    if not customer:
        customer = models.Customer(customer_code="TICKET-CUST", first_name="Jan", last_name="Tester")
        session.add(customer)
        session.commit()

    # 2. Create ticket via API
    resp = admin_client.post(
        "/helpdesk/tickets/new",
        data={
            "title": "Problem z internetem",
            "body": "Nie działa od rana.",
            "status": "open",
            "queue_id": str(queue.id),
            "customer_id": str(customer.id)
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    # 3. Verify in DB
    ticket = session.scalars(select(models.SupportTicket).where(models.SupportTicket.title == "Problem z internetem")).first()
    assert ticket is not None
    assert ticket.status == models.TicketStatus.open
    assert ticket.queue_id == queue.id
    assert ticket.customer_id == customer.id
