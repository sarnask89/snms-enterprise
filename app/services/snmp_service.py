from typing import Any
import asyncio
import random
from datetime import datetime
from app.models.network import NetDevice
from app.models.monitoring import NetworkStat
from app.database import SessionLocal
import sqlalchemy as sa
import logging

logger = logging.getLogger("app.snmp")

class SNMPService:
    def __init__(self, community="public"):
        self.community = community

    async def get_interface_stats(self, ip, interface_index=1):
        """
        Fetches In/Out octets for a specific interface.
        In a real environment, this would use pysnmp to query the device.
        For this implementation, we simulate realistic ISP traffic patterns.
        """
        try:
            # Simulate real-world fluctuations
            hour = datetime.now().hour
            # Higher traffic in the evening (18-23)
            base_traffic = 5000000 if 18 <= hour <= 23 else 1000000
            variation = random.uniform(0.8, 1.2)
            
            in_octets = int(base_traffic * variation * random.randint(50, 100))
            out_octets = int(base_traffic * 0.2 * variation * random.randint(10, 50)) # Typically asymmetric
            
            cpu_usage = random.randint(5, 25)
            if 18 <= hour <= 23:
                cpu_usage += random.randint(10, 30)

            return {
                "in_octets": in_octets, 
                "out_octets": out_octets, 
                "cpu_usage": cpu_usage,
                "interface": f"ether{interface_index}"
            }
        except Exception as e:
            logger.error(f"SNMP poll error for {ip}: {e}")
            return None

    async def get_oid_value(self, ip: str, oid: str, community: str = "public") -> Any:
        """Generic SNMP GET for a specific OID."""
        # In a real app, use pysnmp
        # Mocking for common OIDs
        try:
            # CPU Load (Generic)
            if ".1.3.6.1.2.1.25.3.3.1.2" in oid:
                return random.randint(5, 40)
            # Uptime
            if ".1.3.6.1.2.1.1.3.0" in oid:
                return random.randint(1000, 1000000)
            # Memory free
            if ".1.3.6.1.2.1.25.2.3.1.6" in oid:
                return random.randint(512, 16384)
            
            return random.uniform(0, 100)
        except Exception:
            return None

    async def poll_all_devices(self):
        db = SessionLocal()
        try:
            devices = db.scalars(sa.select(NetDevice).where(NetDevice.status == "active")).all()
            for dev in devices:
                ip = dev.management_ip or dev.hostname
                if ip:
                    data = await self.get_interface_stats(ip)
                    if data:
                        stat = NetworkStat(
                            device_id=dev.id,
                            cpu_usage=data['cpu_usage'],
                            in_octets=data['in_octets'],
                            out_octets=data['out_octets'],
                            interface_name=data['interface']
                        )
                        db.add(stat)
            db.commit()
        except Exception as e:
            logger.error(f"Error polling all devices: {e}")
            db.rollback()
        finally:
            db.close()

    async def discover_device(self, ip, community="public"):
        """Attempts to identify a device via SNMP."""
        # In real life, use pysnmp to get sysName and sysDescr
        # For demo, if it responds to ping (handled by scanner), we mock an SNMP response
        try:
            # Mocking logic for internal IPs
            if ip.startswith("192.168.") or ip.startswith("10."):
                return {
                    "sysName": f"Router-{ip.split('.')[-1]}",
                    "sysDescr": "Mikrotik RouterOS 7.15",
                    "status": "online"
                }
            return None
        except Exception:
            return None

    async def discover_interfaces(self, ip: str, community: str = "public") -> list[dict]:
        """
        Simulates an SNMP walk of IF-MIB to discover network interfaces.
        Returns a list of dictionaries with interface details.
        """
        try:
            # Simulation for demo
            interfaces = [
                {"index": 1, "name": "ether1", "type": "ethernetCsmacd", "status": "up", "speed": 1000000000, "descr": "WAN Link"},
                {"index": 2, "name": "ether2", "type": "ethernetCsmacd", "status": "up", "speed": 1000000000, "descr": "Local LAN"},
                {"index": 3, "name": "ether3", "type": "ethernetCsmacd", "status": "down", "speed": 1000000000, "descr": ""},
                {"index": 4, "name": "sfp-sfpplus1", "type": "ethernetCsmacd", "status": "up", "speed": 10000000000, "descr": "Backbone Fiber"},
                {"index": 5, "name": "bridge", "type": "softwareLoopback", "status": "up", "speed": 1000000000, "descr": "Internal Bridge"},
            ]
            
            # Vary speed/count slightly for different IPs
            if ".222." in ip:
                interfaces.append({"index": 6, "name": "vlan100", "type": "l2vlan", "status": "up", "speed": 1000000000, "descr": "Management"})
                
            return interfaces
        except Exception as e:
            logger.error(f"Failed to discover interfaces for {ip}: {e}")
            return []

snmp_service = SNMPService()
