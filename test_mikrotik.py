import asyncio
from app.database import SessionLocal
from app import models
from app.services.mikrotik_discovery import get_discoverable_networks, sync_device_config
import logging

logging.basicConfig(level=logging.INFO)

async def test():
    db = SessionLocal()
    device = db.query(models.NetDevice).filter(models.NetDevice.driver_type == 'mikrotik_v7').first()
    if not device:
        print("No Mikrotik device found")
        return
    
    print(f"Testing with device: {device.name} ({device.management_ip})")
    
    await sync_device_config(db, device)
    
    interfaces = db.query(models.NetDeviceInterface).filter_by(net_device_id=device.id).all()
    pools = db.query(models.NetDeviceIpPool).filter_by(net_device_id=device.id).all()
    dhcps = db.query(models.NetDeviceDhcpServer).filter_by(net_device_id=device.id).all()
    
    print(f"Found {len(interfaces)} interfaces")
    print(f"Found {len(pools)} pools")
    print(f"Found {len(dhcps)} dhcp servers")
    for d in dhcps:
        print(f" DHCP: {d.name}, Interface ID: {d.interface_id}, Pool: {d.address_pool_name}")
    
    nets = await get_discoverable_networks(db, device)
    print(f"Discovered {len(nets)} networks:")
    for n in nets:
        print(f" - {n}")
        
    db.close()

if __name__ == "__main__":
    asyncio.run(test())
