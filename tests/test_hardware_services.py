import pytest
from app.services.mikrotik_parser import parse_mikrotik_comment

def test_parse_mikrotik_comment():
    # Standard format with apartment
    res1 = parse_mikrotik_comment("1825 Krupka M/33 Mic25")
    assert res1 is not None
    assert res1["external_id"] == "1825"
    assert res1["last_name"] == "Krupka"
    assert res1["apartment_number"] == "33"
    assert res1["street_name"] == "Adama Mickiewicza"
    assert res1["street_number"] == "25"

    # Format without apartment
    res2 = parse_mikrotik_comment("1826 Kowalski slo12")
    assert res2 is not None
    assert res2["external_id"] == "1826"
    assert res2["last_name"] == "Kowalski"
    assert res2["apartment_number"] == ""
    assert res2["street_name"] == "Słowackiego"
    assert res2["street_number"] == "12"

    # Format with alternative apartment
    res3 = parse_mikrotik_comment("1827 Nowak-Nowak m.4 chwa12a")
    assert res3 is not None
    assert res3["external_id"] == "1827"
    assert res3["last_name"] == "Nowak-Nowak"
    assert res3["apartment_number"] == "4"
    assert res3["street_name"] == "os. Chwałki"
    assert res3["street_number"] == "12A"

    # Invalid format
    assert parse_mikrotik_comment("This is a random comment") is None
    assert parse_mikrotik_comment("") is None


@pytest.mark.anyio
async def test_mikrotik_discovery_import(session, monkeypatch):
    from app import models
    from app.services.mikrotik_discovery import get_discoverable_leases

    # 1. Setup Data
    dev = models.NetDevice(name="Test Router", management_ip="192.168.1.1", driver_type="mikrotik_v7")
    session.add(dev)
    
    state = models.LocationState(name="TestState", teryt_code="99")
    dist = models.LocationDistrict(name="TestDist", state=state)
    city = models.LocationCity(name="TestCity", district=dist, is_managed=True)
    street = models.LocationStreet(name="Adama Mickiewicza", city=city)
    session.add_all([state, dist, city, street])
    session.flush()

    # Create a customer to test auto-matching
    c = models.Customer(
        customer_code="T-123", 
        first_name="Test", 
        last_name="Krupka", 
        location_street_id=street.id,
        apartment_number="33",
        status=models.CustomerStatus.active
    )
    session.add(c)
    session.commit()

    # 2. Mock MikrotikService.get_leases
    class MockMikrotikService:
        def __init__(self, *args, **kwargs):
            pass
            
        async def get_leases(self):
            return [
                {
                    "mac-address": "AA:BB:CC:11:22:33",
                    "address": "10.0.0.100",
                    "comment": "1825 Krupka M/33 Mic25"
                },
                {
                    "mac-address": "AA:BB:CC:44:55:66",
                    "address": "10.0.0.101",
                    "comment": "1826 Nowak slo12"
                }
            ]

    monkeypatch.setattr("app.services.mikrotik_discovery.MikrotikService", MockMikrotikService)

    # 3. Run Discovery
    results = await get_discoverable_leases(session, dev)

    # 4. Assertions
    assert len(results) == 1
    
    # Verify auto-imported node exists in DB
    auto_node = session.query(models.Node).filter_by(mac_address="AA:BB:CC:11:22:33").first()
    assert auto_node is not None
    assert auto_node.customer_id == c.id

    match2 = results[0]
    assert match2["mac"] == "AA:BB:CC:44:55:66"
    assert match2["parsed"]["last_name"] == "Nowak"
    assert match2["street_id"] is None
    assert match2["customer_id"] is None
    assert match2["can_auto_import"] is False

