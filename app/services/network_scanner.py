import asyncio
import ipaddress
import subprocess
from typing import List, Dict, Any
from app.services.snmp_service import snmp_service
from app.services.mikrotik import MikrotikService
from app.security_utils import decrypt_password
from sqlalchemy.orm import Session
from app import models
import logging

logger = logging.getLogger("app.scanner")

class NetworkScanner:
    async def ping_ip(self, ip: str) -> bool:
        """Checks if an IP is alive using ping."""
        try:
            # Windows ping: -n 1 (one packet), -w 500 (wait 500ms)
            process = await asyncio.create_subprocess_exec(
                "ping", "-n", "1", "-w", "500", ip,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            await process.communicate()
            return process.returncode == 0
        except Exception:
            return False

    async def scan_subnet(self, cidr: str) -> List[Dict[str, Any]]:
        """Scans a subnet for active hosts and tries to identify them."""
        results = []
        try:
            network = ipaddress.ip_network(cidr, strict=False)
            hosts = list(network.hosts())
            
            # Use chunks to avoid overwhelming the system
            chunk_size = 20
            for i in range(0, len(hosts), chunk_size):
                chunk = hosts[i:i+chunk_size]
                tasks = [self.scan_single_ip(str(h)) for h in chunk]
                chunk_results = await asyncio.gather(*tasks)
                results.extend([r for r in chunk_results if r])
                
        except Exception as e:
            logger.error(f"Subnet scan error ({cidr}): {e}")
        
        return results

    async def scan_single_ip(self, ip: str) -> Dict[str, Any] | None:
        if await self.ping_ip(ip):
            # Try SNMP identification
            snmp_info = await snmp_service.discover_device(ip)
            return {
                "ip": ip,
                "status": "online",
                "snmp": snmp_info
            }
        return None

    async def discover_neighbors(self, db: Session, device_id: int) -> List[Dict[str, Any]]:
        """Discovers neighbors via protocols like LLDP/CDP/MNDP from a managed device."""
        device = db.get(models.NetDevice, device_id)
        if not device:
            return []
            
        if device.driver_type == "mikrotik_v7":
            password = decrypt_password(device.mgmt_password_encrypted)
            mt = MikrotikService(device.management_ip, device.mgmt_username, password)
            neighbors = await mt.get_neighbors()
            
            # Map Mikrotik specific fields to a common format
            mapped = []
            for n in neighbors:
                mapped.append({
                    "identity": n.get("identity"),
                    "ip": n.get("address"),
                    "mac": n.get("mac-address"),
                    "interface": n.get("interface"),
                    "platform": n.get("platform"),
                    "version": n.get("version"),
                    "protocol": n.get("protocol") or "MNDP/LLDP"
                })
            return mapped
            
        return []

network_scanner = NetworkScanner()
