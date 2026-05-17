import logging
from sqlalchemy import select
from app.database import SessionLocal
from app.models import NetDevice, CustomerDevice
from app.services.dasan import DasanService
from app.security_utils import decrypt_password

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

def sync_customer_macs_to_onus(olt_id: int):
    """
    Connects to the OLT, pulls MAC addresses for all active ONUs,
    and updates CustomerDevices to point to the correct ONU NetDevice.
    """
    db = SessionLocal()
    try:
        olt = db.get(NetDevice, olt_id)
        if not olt or olt.driver_type != "dasan_nos":
            logger.error(f"Device {olt_id} is not a valid Dasan OLT.")
            return

        logger.info(f"Connecting to OLT: {olt.name}")
        password = decrypt_password(olt.mgmt_password_encrypted)
        
        host = olt.management_ip
        port = int(host.split(":")[1]) if ":" in host else 22502
        host = host.split(":")[0] if ":" in host else host

        ds = DasanService(host, olt.mgmt_username, password, port=port)
        client, chan = ds._get_connection()
        ds._send_cmd(chan, "terminal length 0")
        
        enable_resp = ds._send_cmd(chan, "enable")
        if "Password" in enable_resp or "password" in enable_resp:
            ds._send_cmd(chan, ds.password)

        logger.info("Fetching active ONUs to determine OLT ports...")
        onu_active_raw = ds._send_cmd(chan, "show onu active", max_wait=10)
        
        import re
        active_olt_ports = set()
        for line in onu_active_raw.splitlines():
            match = re.search(r"^\s*(\d+)\s*\|\s*(\d+)\s*\|", line)
            if match:
                active_olt_ports.add(match.group(1))

        # Map MAC -> (olt_port, onu_id)
        mac_to_onu = {}
        for olt_port in active_olt_ports:
            logger.info(f"Fetching MACs for OLT Port {olt_port}...")
            out = ds._send_cmd(chan, f"show olt mac {olt_port}", max_wait=15)
            
            for line in out.splitlines():
                match = re.search(r"^\s*\d+\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*([0-9a-fA-F:]{17})", line)
                if match:
                    found_olt_port = match.group(1)
                    onu_id = match.group(2)
                    mac = match.group(3).lower().replace("-", ":")
                    mac_to_onu[mac] = (found_olt_port, onu_id)

        client.close()
        
        logger.info(f"Found {len(mac_to_onu)} MACs. Mapping to ONUs in database...")

        # Pre-load all ONUs for this OLT into a dictionary for fast lookup
        onus = db.scalars(
            select(NetDevice)
            .where(NetDevice.parent_device_id == olt.id, NetDevice.device_type == "onu")
        ).all()
        onu_map = {f"{onu.olt_port}-{onu.onu_id}": onu for onu in onus}

        # Update CustomerDevices
        updated_count = 0
        devices = db.scalars(select(CustomerDevice)).all()
        
        for dev in devices:
            if not dev.mac_address:
                continue
                
            mac_formatted = dev.mac_address.lower().replace("-", ":").replace(".", ":")
            
            if mac_formatted in mac_to_onu:
                found_olt_port, onu_id = mac_to_onu[mac_formatted]
                key = f"{found_olt_port}-{onu_id}"
                
                if key in onu_map:
                    target_onu = onu_map[key]
                    
                    # Update if not pointing to this ONU
                    if dev.net_device_id != target_onu.id:
                        dev.net_device_id = target_onu.id
                        dev.olt_port = None # We don't need this on the customer anymore, it's on the ONU
                        dev.onu_id = None
                        updated_count += 1
                        logger.info(f"Updated Device ID {dev.id} ({mac_formatted}): Assigned to ONU {target_onu.name}")

        if updated_count > 0:
            db.commit()
            logger.info(f"Successfully mapped {updated_count} customer devices to their ONUs.")
        else:
            logger.info("No updates required. All MACs are mapped correctly.")

    except Exception as e:
        logger.error(f"Sync failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        sync_customer_macs_to_onus(int(sys.argv[1]))
    else:
        print("Usage: python sync_macs_to_onus.py <olt_device_id>")
