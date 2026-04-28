import pytest
import re
import uuid
from app import models

@pytest.mark.integration
def test_core_login_flow(admin_client):
    """Verify that a user can login and see the dashboard."""
    resp = admin_client.get("/")
    assert resp.status_code == 200
    assert "Pulpit" in resp.text
    assert "Wyloguj" in resp.text

@pytest.mark.integration
def test_core_customer_crud(admin_client, session):
    """Test customer creation, update and listing."""
    client = admin_client
    tag = uuid.uuid4().hex[:6]
    code = f"CORE-CUST-{tag}"
    
    # 1. Create
    r = client.post(
        "/customers/new",
        data={
            "customer_code": code,
            "first_name": "Core",
            "last_name": "Tester",
            "status": "active"
        },
        follow_redirects=False
    )
    assert r.status_code == 303
    
    # 2. List
    page = client.get("/customers", params={"q": code})
    assert code in page.text
    
    # 3. Edit
    m = re.search(f'href="/customers/(\\d+)/edit"', page.text)
    assert m
    cid = m.group(1)
    
    r = client.post(
        f"/customers/{cid}/edit",
        data={
            "customer_code": code,
            "first_name": "Core-Updated",
            "last_name": "Tester",
            "status": "active"
        },
        follow_redirects=False
    )
    assert r.status_code == 303
    
    c = session.get(models.Customer, int(cid))
    assert c.first_name == "Core-Updated"

@pytest.mark.integration
def test_core_tariff_and_vat(admin_client, session):
    """Verify tariff creation with VAT logic."""
    client = admin_client
    vat = session.query(models.VatRate).filter_by(label="23%").first()
    if not vat:
        vat = models.VatRate(label="23%", rate_percent=23.0, is_default=True)
        session.add(vat)
        session.commit()

    tag = uuid.uuid4().hex[:6]
    name = f"Core-Plan-{tag}"
    
    r = client.post(
        "/finances/tariffs/new",
        data={
            "name": name,
            "monthly_price": "100.00",
            "vat_rate_id": str(vat.id),
            "active": "on"
        },
        follow_redirects=False
    )
    assert r.status_code == 303
    
    t = session.query(models.Tariff).filter_by(name=name).first()
    assert t is not None
    # Verify our custom property works
    assert t.monthly_price_gross == 123.00

@pytest.mark.integration
def test_core_net_node_flow(admin_client, session):
    """Test infrastructure node creation."""
    client = admin_client
    # Need a city
    city = session.query(models.LocationCity).first()
    if not city:
        # Emergency seed if conftest didn't
        state = models.LocationState(name="T-State", teryt_code="TS")
        dist = models.LocationDistrict(name="T-Dist", state=state)
        city = models.LocationCity(name="T-City", district=dist, is_managed=True, is_active=True)
        session.add_all([state, dist, city])
        session.commit()

    r = client.post(
        "/net-nodes/new",
        data={
            "name": "CORE-POP-01",
            "location_city_id": str(city.id),
            "street_number": "10",
            "latitude": "50.1",
            "longitude": "20.1"
        },
        follow_redirects=False
    )
    assert r.status_code == 303
    
    node = session.query(models.NetNode).filter_by(name="CORE-POP-01").first()
    assert node is not None
    assert node.location_city_id == city.id

@pytest.mark.integration
def test_core_subscription_linking(admin_client, session):
    """Verify subscription links customer and tariff."""
    client = admin_client
    
    # 1. Setup
    c = models.Customer(customer_code="SUB-C-01", first_name="S", last_name="T")
    t = models.Tariff(name="SUB-T-01", monthly_price=60.00)
    session.add_all([c, t])
    session.commit()
    
    # 2. Create Sub
    r = client.post(
        "/subscriptions/new",
        data={
            "customer_id": str(c.id),
            "tariff_id": str(t.id),
            "start_date": "2026-01-01",
            "active": "on"
        },
        follow_redirects=False
    )
    assert r.status_code == 303
    
    sub = session.query(models.Subscription).filter_by(customer_id=c.id).first()
    assert sub is not None
    assert sub.tariff_id == t.id
