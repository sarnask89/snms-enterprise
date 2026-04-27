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
    logger.info(f"Rozpoczęcie procesu odkrywania dla urządzenia {device.name} ({device.management_ip})")
    
    # 1. Inicjalizacja serwisu (hasło odszyfrowane)
    password = decrypt_password(device.mgmt_password_encrypted)
    if not password:
        logger.warning(f"Brak hasła dla urządzenia {device.name}. Autoryzacja może się nie powieść.")
        
    mt = MikrotikService(device.management_ip, device.mgmt_username, password)
    
    raw_leases = await mt.get_leases()
    logger.info(f"Otrzymano {len(raw_leases)} surowych dzierżaw DHCP z urządzenia {device.name}")
    
    discovered = []

    for lease in raw_leases:
        # Ignore disabled leases
        if str(lease.get('disabled', 'false')).lower() == 'true':
            logger.debug(f"Pominięto wyłączoną dzierżawę dla {lease.get('mac-address')}.")
            continue
            
        mac = lease.get('mac-address')
        if not mac: 
            logger.debug("Pominięto dzierżawę bez adresu MAC.")
            continue

        # Determine node status based on blocked attribute
        is_blocked = str(lease.get('blocked', 'false')).lower() == 'true'
        node_status = models.NodeStatus.inactive if is_blocked else models.NodeStatus.active

        # 2. Czy ten MAC już istnieje w CRM?
        existing_node = db.scalar(select(models.Node).where(models.Node.mac_address == mac))
        if existing_node:
            logger.debug(f"Pominięto dzierżawę z MAC {mac} - istnieje już w CRM jako węzeł ID {existing_node.id}")
            continue # Już go znamy

        # 3. Parsowanie komentarza
        comment = lease.get('comment', '')
        logger.debug(f"Analizowanie komentarza dzierżawy dla MAC {mac}: '{comment}'")
        parsed = parse_mikrotik_comment(comment)
        
        match_info = {
            "mac": mac,
            "ip": lease.get('address'),
            "comment": comment,
            "parsed": parsed,
            "customer_id": None,
            "street_id": None,
            "can_auto_import": False,
            "status": node_status
        }

        if parsed:
            logger.debug(f"Pomyślnie sparsowano komentarz dla MAC {mac}: {parsed}")
            # 4. Próba dopasowania ulicy
            street = db.scalar(
                select(models.LocationStreet)
                .where(models.LocationStreet.name.ilike(f"%{parsed['street_name']}%"))
            )
            if street:
                logger.debug(f"Dopasowano ulicę: '{street.name}' (ID: {street.id}) dla MAC {mac}")
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
                
                # 6. AUTO-IMPORT LOGIC
                if not customer:
                    logger.info(f"Tworzenie nowego klienta dla {parsed['last_name']} z MAC {mac}")
                    customer = models.Customer(
                        customer_code=f"AUTO-{mac.replace(':', '')[-6:]}",
                        first_name="Abonent",
                        last_name=parsed["last_name"],
                        location_street_id=street.id,
                        street_number=parsed["street_number"],
                        apartment_number=parsed["apartment_number"],
                        status=models.CustomerStatus.active
                    )
                    db.add(customer)
                    db.flush()
                
                logger.info(f"Auto-import węzła dla MAC {mac} do klienta ID {customer.id}")
                node = models.Node(
                    customer_id=customer.id,
                    hostname=f"node-{mac.replace(':', '')[-4:]}",
                    ip_address=lease.get('address'),
                    mac_address=mac,
                    net_device_id=device.id,
                    status=node_status
                )
                db.add(node)
                db.commit()
                continue  # Successfully auto-imported, skip adding to discovery UI
            else:
                logger.debug(f"Nie dopasowano ulicy '{parsed['street_name']}' dla MAC {mac}")
        else:
            logger.debug(f"Nie udało się sparsować komentarza '{comment}' dla MAC {mac}")
            
        discovered.append(match_info)

    logger.info(f"Zakończono odkrywanie dla {device.name}. Zwrócono {len(discovered)} nowych dzierżaw do ewentualnego importu.")
    return discovered
