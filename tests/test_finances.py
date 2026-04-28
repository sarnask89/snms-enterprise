import pytest
from decimal import Decimal
from app import models

def test_tariff_monthly_price_gross_calculation(db):
    """Test that gross price is correctly calculated from net price and VAT rate."""
    # 1. Create a VAT rate (23%)
    vat = models.VatRate(label="23%", rate_percent=Decimal("23.00"), is_default=True)
    db.add(vat)
    db.flush()
    
    # 2. Create a tariff with 100.00 Netto
    tariff = models.Tariff(
        name="Test Fiber",
        monthly_price=Decimal("100.00"),
        vat_rate_id=vat.id,
        active=True
    )
    db.add(tariff)
    db.flush()
    db.refresh(tariff)
    
    # 3. Verify Gross is 123.00
    assert tariff.monthly_price_gross == Decimal("123.00")

def test_tariff_no_vat_rate(db):
    """Test that gross price equals net price if no VAT rate is assigned."""
    tariff = models.Tariff(
        name="Test Fiber No VAT",
        monthly_price=Decimal("100.00"),
        vat_rate_id=None,
        active=True
    )
    db.add(tariff)
    db.flush()
    db.refresh(tariff)
    
    assert tariff.monthly_price_gross == Decimal("100.00")

def test_calculate_net_from_gross():
    """Test utility logic for decreasing gross price by VAT to get net."""
    # This simulates entering 123.00 Brutto and expecting 100.00 Netto
    gross = Decimal("123.00")
    vat_percent = Decimal("23.00")
    
    # Logic: net = gross / (1 + vat/100)
    net = (gross / (Decimal("1") + (vat_percent / Decimal("100")))).quantize(Decimal("0.01"))
    
    assert net == Decimal("100.00")

def test_vat_utility_calculate_net():
    """Verify the existence and correctness of a central VAT utility."""
    from app.finances import calculate_net_from_gross
    
    # 1. Standard calculation
    net = calculate_net_from_gross(Decimal("123.00"), Decimal("23.00"))
    assert net == Decimal("100.00")

    # 2. Edge case: zero/None gross
    assert calculate_net_from_gross(None, Decimal("23.00")) == Decimal("0.00")
    assert calculate_net_from_gross(0, Decimal("23.00")) == Decimal("0.00")

    # 3. Edge case: zero/None VAT
    assert calculate_net_from_gross(Decimal("100.00"), None) == Decimal("100.00")
    assert calculate_net_from_gross(Decimal("100.00"), 0) == Decimal("100.00")
