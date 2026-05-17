import asyncio
import logging
from sqlalchemy import select
from app.database import SessionLocal
from app.models import NetDevice
from app.services.dasan import DasanService
from app.security_utils import decrypt_password

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

def discover_onus(olt_id: int):
    """
    Connects to an OLT, discovers all active ONUs, and imports them as 
    standalone NetDevices linked to the OLT.
    """
    db = SessionLocal()
    try:
        olt = db.get(NetDevice, olt_id)
        if not olt or olt.driver_type != "dasan_nos":
            logger.error(f"Device {olt_id} is not a valid Dasan OLT.")
            return

        logger.info(f"Connecting to OLT: {olt.name} ({olt.management_ip})")
        password = decrypt_password(olt.mgmt_password_encrypted)
        
        host = olt.management_ip
        port = 22502
        if ":" in host:
            host, port_str = host.split(":")
            port = int(port_str)

        ds = DasanService(host, olt.mgmt_username, password, port=port)
        
        client, chan = ds._get_connection()
        ds._send_cmd(chan, "terminal length 0")
        
        enable_resp = ds._send_cmd(chan, "enable")
        if "Password" in enable_resp or "password" in enable_resp:
            ds._send_cmd(chan, ds.password)

        logger.info("Fetching active ONUs...")
        onu_active_raw = ds._send_cmd(chan, "show onu active", max_wait=10)
        
        import re
        
        existing_onus_query = db.scalars(
            select(NetDevice).where(NetDevice.parent_device_id == olt.id, NetDevice.device_type == "onu")
        ).all()
        
        # Mapa istniejacych onu (port-id -> db_id)
        existing_onus = {f"{onu.olt_port}-{onu.onu_id}": onu for onu in existing_onus_query}
        
        discovered_count = 0
        added_count = 0
        
        for line in onu_active_raw.splitlines():
            # Szukamy: 1 | 5 | Active | manual | HALN08196530 | 3030... | 16:05:55:37
            match = re.search(r"^\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\w+)\s*\|\s*\w+\s*\|\s*(\w+)", line)
            if match:
                olt_port = match.group(1)
                onu_id = match.group(2)
                status = match.group(3)
                serial = match.group(4)
                
                discovered_count += 1
                key = f"{olt_port}-{onu_id}"
                
                if key in existing_onus:
                    # Update status/serial if needed
                    existing = existing_onus[key]
                    if existing.serial_number != serial:
                        existing.serial_number = serial
                    if status.lower() == "active":
                        existing.is_online = True
                        existing.status = "active"
                    else:
                        existing.is_online = False
                        existing.status = "inactive"
                else:
                    # Create new ONU NetDevice
                    new_onu = NetDevice(
                        name=f"ONU {olt_port}/{onu_id} ({serial})",
                        device_type="onu",
                        parent_device_id=olt.id,
                        olt_port=olt_port,
                        onu_id=onu_id,
                        serial_number=serial,
                        status="active" if status.lower() == "active" else "inactive",
                        is_online=(status.lower() == "active"),
                        notes=f"Auto-discovered from OLT {olt.name}"
                    )
                    db.add(new_onu)
                    added_count += 1

        db.commit()
        logger.info(f"Discovered {discovered_count} ONUs on {olt.name}. Added {added_count} new entries to NetDevices.")

        client.close()

    except Exception as e:
        logger.error(f"Discovery failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        discover_onus(int(sys.argv[1]))
    else:
        print("Usage: python sync_onus.py <olt_device_id>")
