import pytest
from app import models

def test_customer_create_with_teryt_address(admin_client, session):
    # Setup: need a city/street
    state = models.LocationState(name="Integration-State", teryt_code="91")
    dist = models.LocationDistrict(name="Integration-Dist", state=state, teryt_code="9101")
    city = models.LocationCity(name="Integration-City", district=dist, is_managed=True, is_active=True)
    street = models.LocationStreet(name="Integration-Street", city=city, teryt_code="91011")
    session.add_all([state, dist, city, street])
    session.commit()


    resp = admin_client.post(
        "/customers/new",
        data={
            "customer_code": "T-101",
            "first_name": "Teryt",
            "last_name": "User",
            "email": "teryt@test.local",
            "status": "active",
            "location_city_id": city.id,
            "location_street_id": street.id,
            "street_name": "TestStreet",
            "street_number": "10A",
            "apartment_number": "5",
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    # Verify in DB
    c = session.query(models.Customer).filter_by(customer_code="T-101").one()
    assert c.location_city_id == city.id
    assert c.location_street_id == street.id
    assert c.street_number == "10A"
    assert c.apartment_number == "5"

def test_customer_edit_with_teryt_address(admin_client, session):
    # Setup: existing customer
    state = models.LocationState(name="E-State-Edit", teryt_code="92")
    dist = models.LocationDistrict(name="E-Dist-Edit", state=state, teryt_code="9201")
    city = models.LocationCity(name="E-City-Edit", district=dist, is_managed=True, is_active=True)
    session.add_all([state, dist, city])
    session.commit()
    
    c = models.Customer(customer_code="E-202", first_name="Edit", last_name="User", status=models.CustomerStatus.active)
    session.add(c)
    session.commit()

    resp = admin_client.post(
        f"/customers/{c.id}/edit",
        data={
            "customer_code": "E-202",
            "first_name": "Edited",
            "last_name": "User",
            "status": "active",
            "location_city_id": city.id,
            "street_name": "NewStreet",
            "street_number": "99",
            "apartment_number": "1",
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    session.refresh(c)
    assert c.first_name == "Edited"
    assert c.location_city_id == city.id
    assert c.street_number == "99"
    assert c.apartment_number == "1"
