from decimal import Decimal

def calculate_net_from_gross(gross: Decimal, vat_percent: Decimal) -> Decimal:
    """
    Calculates net price from gross price by decreasing it by VAT.
    Formula: net = gross / (1 + vat/100)
    """
    if not gross:
        return Decimal("0.00")
    if not vat_percent:
        return Decimal(str(gross)).quantize(Decimal("0.01"))
        
    gross = Decimal(str(gross))
    vat = Decimal(str(vat_percent))
    
    net = gross / (Decimal("1") + (vat / Decimal("100")))
    return net.quantize(Decimal("0.01"))
