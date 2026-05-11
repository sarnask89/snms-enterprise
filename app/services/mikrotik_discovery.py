import logging
import ipaddress
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app import models
from app.services.mikrotik import MikrotikService
from app.services.mikrotik_parser import parse_mikrotik_comment
from app.security_utils import decrypt_password

logger = logging.getLogger(__name__)

async def get_discoverable_leases(db: Session, device: models.NetDevice):
    """
    Pobiera dzierżawy z Mikrotika i przygotowuje je do wyświetlenia w UI Discovery.
    Funkcja jest TYLKO DO ODCZYTU - nie tworzy żadnych rekordów w bazie.
    """
    logger.info(f"Rozpoczęcie procesu odkrywania dla urządzenia {device.name} ({device.management_ip})")
    
    password = decrypt_password(device.mgmt_password_encrypted)
    mt = MikrotikService(device.management_ip, device.mgmt_username, password)
    
    # 1. Pobierz sieci przypisane do tego urządzenia w CRM
    device_networks = db.scalars(
        select(models.IpNetwork).where(models.IpNetwork.net_device_id == device.id, models.IpNetwork.active == True)
    ).all()
    
    net_objs = []
    for dn in device_networks:
        try:
            net_objs.append(ipaddress.ip_network(dn.cidr, strict=False))
        except ValueError:
            pass
    
    if not net_objs:
        logger.warning(f"Brak przypisanych sieci w CRM dla urządzenia {device.name}. Lista dzierżaw będzie pusta.")

    raw_leases = await mt.get_leases()
    discovered = []

    for lease in raw_leases:
        mac = lease.get('mac-address')
        ip_str = lease.get('address')
        if not mac or not ip_str: 
            continue

        # 2. Weryfikacja czy IP należy do sieci przypisanych do tego urządzenia
        try:
            ip_obj = ipaddress.ip_address(ip_str)
            if not any(ip_obj in n for n in net_objs):
                continue
        except ValueError:
            continue

        # 3. Czy ten MAC już istnieje w CRM?
        existing_device_record = db.scalar(select(models.CustomerDevice).where(models.CustomerDevice.mac_address == mac))
        if existing_device_record:
            continue

        # 4. Parsowanie komentarza i próba dopasowania
        comment = lease.get('comment', '')
        parsed = parse_mikrotik_comment(comment)
        
        is_disabled = str(lease.get('disabled', 'false')).lower() == 'true'
        is_blocked = str(lease.get('blocked', 'false')).lower() == 'true'
        node_status = models.CustomerDeviceStatus.inactive if (is_blocked or is_disabled) else models.CustomerDeviceStatus.active

        match_info = {
            "mac": mac,
            "ip": ip_str,
            "comment": comment,
            "rate_limit": lease.get('rate-limit'),
            "parsed": parsed,
            "customer_id": None,
            "street_id": None,
            "can_auto_import": False,
            "status": node_status,
            "dhcp_server": lease.get('server', ''),
            "dhcp_interface": lease.get('interface', ''),
        }

        if parsed:
            # Próba dopasowania ulicy
            street = db.scalar(
                select(models.LocationStreet)
                .where(models.LocationStreet.name.ilike(f"%{parsed['street_name']}%"))
            )
            if street:
                match_info["street_id"] = street.id
                
                # Próba dopasowania klienta
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
                else:
                    # Jeśli mamy sparsowane dane ale brak klienta, to też możemy "auto-importować" tworząc nowego klienta
                    match_info["can_auto_import"] = True

        discovered.append(match_info)

    logger.info(f"Zakończono odkrywanie dla {device.name}. Zwrócono {len(discovered)} pozycji.")
    return discovered

async def sync_device_config(db: Session, device: models.NetDevice):
    """
    Synchronizuje konfigurację interfejsów, pul adresów i serwerów DHCP z Mikrotika do CRM.
    """
    logger.info(f"Rozpoczęcie synchronizacji konfiguracji dla urządzenia {device.name}")
    
    password = decrypt_password(device.mgmt_password_encrypted)
    mt = MikrotikService(device.management_ip, device.mgmt_username, password)
    
    # 1. Interfejsy
    interfaces_data = await mt.get_interfaces()
    for iface in interfaces_data:
        name = iface.get("name")
        if not name: continue
        mac = iface.get("mac-address")
        is_disabled = str(iface.get("disabled", "false")).lower() == "true"
        comment = iface.get("comment")
        
        db_iface = db.scalar(select(models.NetDeviceInterface).where(
            models.NetDeviceInterface.net_device_id == device.id,
            models.NetDeviceInterface.name == name
        ))
        if not db_iface:
            db_iface = models.NetDeviceInterface(net_device_id=device.id, name=name)
            db.add(db_iface)
        
        db_iface.mac_address = mac
        db_iface.is_active = not is_disabled
        db_iface.comment = comment

    db.flush()

    # 2. Pule IP
    pools_data = await mt.get_ip_pools()
    for pool in pools_data:
        name = pool.get("name")
        ranges = pool.get("ranges")
        if not name or not ranges: continue
        
        db_pool = db.scalar(select(models.NetDeviceIpPool).where(
            models.NetDeviceIpPool.net_device_id == device.id,
            models.NetDeviceIpPool.name == name
        ))
        if not db_pool:
            db_pool = models.NetDeviceIpPool(net_device_id=device.id, name=name)
            db.add(db_pool)
            
        db_pool.ranges = ranges

    db.flush()

    # 3. Serwery DHCP
    dhcp_data = await mt.get_dhcp_servers()
    for dhcp in dhcp_data:
        name = dhcp.get("name")
        iface_name = dhcp.get("interface")
        pool_name = dhcp.get("address-pool")
        is_disabled = str(dhcp.get("disabled", "false")).lower() == "true"
        if not name: continue

        db_dhcp = db.scalar(select(models.NetDeviceDhcpServer).where(
            models.NetDeviceDhcpServer.net_device_id == device.id,
            models.NetDeviceDhcpServer.name == name
        ))
        if not db_dhcp:
            db_dhcp = models.NetDeviceDhcpServer(net_device_id=device.id, name=name)
            db.add(db_dhcp)

        # Znajdź interface w DB
        if iface_name:
            iface_db = db.scalar(select(models.NetDeviceInterface).where(
                models.NetDeviceInterface.net_device_id == device.id,
                models.NetDeviceInterface.name == iface_name
            ))
            if iface_db:
                db_dhcp.interface_id = iface_db.id

        db_dhcp.address_pool_name = pool_name
        db_dhcp.is_active = not is_disabled

    db.commit()
    logger.info(f"Zakończono synchronizację konfiguracji dla urządzenia {device.name}")


async def get_discoverable_networks(db: Session, device: models.NetDevice):
    """
    Pobiera podsieci z serwera DHCP Mikrotika i przygotowuje je do importu jako IpNetwork do CRM.
    """
    logger.info(f"Rozpoczęcie odkrywania podsieci DHCP dla urządzenia {device.name}")
    
    password = decrypt_password(device.mgmt_password_encrypted)
    mt = MikrotikService(device.management_ip, device.mgmt_username, password)
    
    # Najpierw synchronizuj bazę (żeby mieć aktualne DHCP serwery w CRM)
    await sync_device_config(db, device)
    
    raw_networks = await mt.get_dhcp_networks()
    discovered_nets = []

    for net in raw_networks:
        address_cidr = net.get('address')
        if not address_cidr or '/' not in address_cidr: 
            continue

        gateway = net.get('gateway', '')
        comment = net.get('comment', '')
        
        # Opcjonalnie dns-server, ntp-server...

        # Check if CIDR already exists in CRM FOR THIS DEVICE
        existing_net = db.scalar(
            select(models.IpNetwork)
            .where(models.IpNetwork.cidr == address_cidr, models.IpNetwork.net_device_id == device.id)
        )
        if existing_net:
            continue

        net_info = {
            "cidr": address_cidr,
            "gateway": gateway,
            "comment": comment,
            "status": "active"
        }
        discovered_nets.append(net_info)

    return discovered_nets
