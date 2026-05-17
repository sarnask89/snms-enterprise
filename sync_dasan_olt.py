import asyncio
import logging
from sqlalchemy import select
from app.database import SessionLocal
from app.models import NetDevice, CustomerDevice
from app.services.dasan import DasanService
from app.security_utils import decrypt_password

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

def sync_olt_data(olt_id: int):
    """
    Connects to an OLT, discovers all ONUs and their MAC addresses,
    and updates the corresponding CustomerDevice records.
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
        
        # We need a new method in DasanService to dump all GPON MACs
        # Let's use get_onu_and_macs() but we need to modify it first 
        # to correctly map OLT -> ONU -> MAC
        
        # For now, let's fetch active ONUs and iterate (as discovered earlier)
        client, chan = ds._get_connection()
        ds._send_cmd(chan, "terminal length 0")
        
        enable_resp = ds._send_cmd(chan, "enable")
        if "Password" in enable_resp or "password" in enable_resp:
            ds._send_cmd(chan, ds.password)

        logger.info("Fetching active ONUs...")
        onu_active_raw = ds._send_cmd(chan, "show onu active", max_wait=10)
        active_olt_ports = set()
        
        import re
        for line in onu_active_raw.splitlines():
            match = re.search(r"^\s*(\d+)\s*\|\s*(\d+)\s*\|", line)
            if match:
                active_olt_ports.add(match.group(1))

        mac_to_onu = {} # MAC -> (olt_port, onu_id)
        
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

        logger.info(f"Found {len(mac_to_onu)} GPON MACs. Updating database...")

        # Update CustomerDevices
        updated_count = 0
        devices = db.scalars(select(CustomerDevice)).all()
        
        for dev in devices:
            if not dev.mac_address:
                continue
                
            mac_formatted = dev.mac_address.lower().replace("-", ":").replace(".", ":")
            
            if mac_formatted in mac_to_onu:
                found_olt_port, onu_id = mac_to_onu[mac_formatted]
                
                # Check if it needs updating
                if dev.net_device_id != olt.id or dev.olt_port != found_olt_port or dev.onu_id != onu_id:
                    dev.net_device_id = olt.id
                    dev.olt_port = found_olt_port
                    dev.onu_id = onu_id
                    updated_count += 1
                    logger.info(f"Updated Device ID {dev.id} ({mac_formatted}): OLT={olt.name}, Port={found_olt_port}, ONU={onu_id}")

        if updated_count > 0:
            db.commit()
            logger.info(f"Successfully updated {updated_count} customer devices.")
        else:
            logger.info("No updates required. All MACs are up to date.")

    except Exception as e:
        logger.error(f"Sync failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        sync_olt_data(int(sys.argv[1]))
    else:
        print("Usage: python sync_dasan_olt.py <net_device_id>")
