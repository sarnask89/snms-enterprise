import logging
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app import models
from app.services.mikrotik import MikrotikService
from app.services.mikrotik_parser import parse_mikrotik_comment
from app.security_utils import decrypt_password

logger = logging.getLogger(__name__)

async def get_discoverable_leases(db: Session, device: models.NetDevice):
    """
    Pobiera dzierżawy z Mikrotika i przygotowuje je do importu do CRM.
    """
    # 1. Inicjalizacja serwisu (hasło odszyfrowane)
    password = decrypt_password(device.mgmt_password_encrypted)
    mt = MikrotikService(device.management_ip, device.mgmt_username, password)
    
    raw_leases = await mt.get_leases()
    discovered = []

    for lease in raw_leases:
        mac = lease.get('mac-address')
        if not mac: continue

        # 2. Czy ten MAC już istnieje w CRM?
        existing_node = db.scalar(select(models.Node).where(models.Node.mac_address == mac))
        if existing_node:
            continue # Już go znamy

        # 3. Parsowanie komentarza
        comment = lease.get('comment', '')
        parsed = parse_mikrotik_comment(comment)
        
        match_info = {
            "mac": mac,
            "ip": lease.get('address'),
            "comment": comment,
            "parsed": parsed,
            "customer_id": None,
            "street_id": None,
            "can_auto_import": False
        }

        if parsed:
            # 4. Próba dopasowania ulicy
            street = db.scalar(
                select(models.LocationStreet)
                .where(models.LocationStreet.name.ilike(f"%{parsed['street_name']}%"))
            )
            if street:
                match_info["street_id"] = street.id
                
                # 5. Próba dopasowania klienta (po nazwisku i lokalu)
                customer = db.scalar(
                    select(models.Customer)
                    .where(
                        models.Customer.last_name.ilike(parsed["last_name"]),
                        models.Customer.apartment_number == parsed["apartment_number"],
                        models.Customer.location_street_id == street.id
                    )
                )
                if customer:
                    match_info["customer_id"] = customer.id
                    match_info["can_auto_import"] = True
            
        discovered.append(match_info)

    return discovered
