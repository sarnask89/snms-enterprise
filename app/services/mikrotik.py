import logging
import routeros_api
import asyncio
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class MikrotikService:
    def __init__(self, host: str, user: str, password: str, port: int = 8728):
        self.host = host
        self.user = user
        self.password = password
        self.port = port

    def _get_api(self):
        # We use plaintext_login=True for RouterOS v6.43+ and v7 if using older API logic
        # RouterOS API connects via TCP socket
        logger.info(f"Mikrotik: Connecting to {self.host}:{self.port} as {self.user}")
        connection = routeros_api.RouterOsApiPool(
            self.host, 
            username=self.user, 
            password=self.password, 
            port=self.port,
            plaintext_login=True
        )
        return connection, connection.get_api()

    async def get_leases(self) -> List[Dict[str, Any]]:
        """Pobiera listę wszystkich dzierżaw DHCP."""
        def fetch():
            try:
                conn, api = self._get_api()
                leases_resource = api.get_resource('/ip/dhcp-server/lease')
                data = leases_resource.get()
                conn.disconnect()
                logger.info(f"Mikrotik: Zwrócono {len(data)} dzierżaw z portu {self.port}.")
                return data
            except Exception as e:
                logger.error(f"Mikrotik API error (get_leases): {e}", exc_info=True)
                return []
        
        return await asyncio.to_thread(fetch)

    async def get_ip_addresses(self) -> List[Dict[str, Any]]:
        """Pobiera listę adresów IP (podsieci) z interfejsów."""
        def fetch():
            try:
                conn, api = self._get_api()
                addr_resource = api.get_resource('/ip/address')
                data = addr_resource.get()
                conn.disconnect()
                logger.info(f"Mikrotik: Zwrócono {len(data)} adresów z portu {self.port}.")
                return data
            except Exception as e:
                logger.error(f"Mikrotik API error (get_ip_addresses): {e}", exc_info=True)
                return []
        
        return await asyncio.to_thread(fetch)

    async def get_interfaces(self) -> List[Dict[str, Any]]:
        def fetch():
            try:
                conn, api = self._get_api()
                data = api.get_resource('/interface').get()
                conn.disconnect()
                return data
            except Exception as e:
                logger.error(f"Mikrotik API error (get_interfaces): {e}", exc_info=True)
                return []
        return await asyncio.to_thread(fetch)

    async def get_ip_pools(self) -> List[Dict[str, Any]]:
        def fetch():
            try:
                conn, api = self._get_api()
                data = api.get_resource('/ip/pool').get()
                conn.disconnect()
                return data
            except Exception as e:
                logger.error(f"Mikrotik API error (get_ip_pools): {e}", exc_info=True)
                return []
        return await asyncio.to_thread(fetch)

    async def get_dhcp_servers(self) -> List[Dict[str, Any]]:
        def fetch():
            try:
                conn, api = self._get_api()
                data = api.get_resource('/ip/dhcp-server').get()
                conn.disconnect()
                return data
            except Exception as e:
                logger.error(f"Mikrotik API error (get_dhcp_servers): {e}", exc_info=True)
                return []
        return await asyncio.to_thread(fetch)

    async def get_dhcp_networks(self) -> List[Dict[str, Any]]:
        def fetch():
            try:
                conn, api = self._get_api()
                data = api.get_resource('/ip/dhcp-server/network').get()
                conn.disconnect()
                return data
            except Exception as e:
                logger.error(f"Mikrotik API error (get_dhcp_networks): {e}", exc_info=True)
                return []
        return await asyncio.to_thread(fetch)

    async def upsert_static_lease(self, mac: str, address: str, comment: str, rate_limit: str = None):
        """Dodaje lub aktualizuje statyczną dzierżawę DHCP."""
        def sync_upsert():
            try:
                conn, api = self._get_api()
                leases_resource = api.get_resource('/ip/dhcp-server/lease')
                existing = leases_resource.get(**{'mac-address': mac})
                
                payload = {
                    'mac-address': mac,
                    'address': address,
                    'comment': comment,
                }
                if rate_limit:
                    payload['rate-limit'] = rate_limit

                if existing:
                    lease_id = existing[0]['id']
                    leases_resource.set(id=lease_id, **payload)
                else:
                    leases_resource.add(**payload)
                    
                conn.disconnect()
                return True, "OK"
            except Exception as e:
                logger.error(f"Mikrotik API error (upsert_lease): {e}", exc_info=True)
                return False, str(e)
                
        return await asyncio.to_thread(sync_upsert)

    async def remote_ping(self, target: str, count: int = 4):
        """Wykonuje ping ICMP z routera do celu."""
        def sync_ping():
            try:
                conn, api = self._get_api()
                res = api.get_binary_resource('/').call('ping', {
                    'address': target.encode(), 
                    'count': str(count).encode()
                })
                conn.disconnect()
                decoded = []
                for r in res:
                    item = {}
                    for k, v in r.items():
                        item[k.decode() if isinstance(k, bytes) else k] = \
                            v.decode() if isinstance(v, bytes) else v
                    decoded.append(item)
                return decoded
            except Exception as e:
                logger.error(f"Mikrotik API error (ping): {e}", exc_info=True)
                return []
        return await asyncio.to_thread(sync_ping)

    async def remote_arp_ping(self, target: str, count: int = 3):
        """Wykonuje ARP ping. Automatycznie wykrywa interfejs z tablicy ARP."""
        def sync_arp_ping():
            try:
                conn, api = self._get_api()
                arp_res = api.get_resource('/ip/arp')
                entry = arp_res.get(address=target)
                if not entry:
                    conn.disconnect()
                    return [{"status": "ARP entry not found"}]
                interface = entry[0].get('interface')
                if not interface:
                    conn.disconnect()
                    return [{"status": "Interface not found in ARP"}]
                res = api.get_binary_resource('/').call('ping', {
                    'address': target.encode(), 
                    'count': str(count).encode(),
                    'arp-ping': b'yes',
                    'interface': interface.encode()
                })
                conn.disconnect()
                decoded = []
                for r in res:
                    item = {"interface": interface}
                    for k, v in r.items():
                        item[k.decode() if isinstance(k, bytes) else k] = \
                            v.decode() if isinstance(v, bytes) else v
                    decoded.append(item)
                return decoded
            except Exception as e:
                logger.error(f"Mikrotik API error (arp-ping): {e}", exc_info=True)
                return []
        return await asyncio.to_thread(sync_arp_ping)

    async def get_lease_info(self, mac: str) -> Dict[str, Any]:
        """Pobiera status dzierżawy DHCP dla danego adresu MAC."""
        def fetch():
            try:
                conn, api = self._get_api()
                leases_resource = api.get_resource('/ip/dhcp-server/lease')
                data = leases_resource.get(**{'mac-address': mac})
                conn.disconnect()
                return data[0] if data else None
            except Exception as e:
                logger.error(f"Mikrotik API error (get_lease_info): {e}", exc_info=True)
                return None
        return await asyncio.to_thread(fetch)

    async def get_bridge_host_info(self, mac: str) -> List[Dict[str, Any]]:
        """Sprawdza czy adres MAC jest widoczny w tablicy hostów bridge."""
        def fetch():
            try:
                conn, api = self._get_api()
                bridge_resource = api.get_resource('/interface/bridge/host')
                data = bridge_resource.get(**{'mac-address': mac})
                conn.disconnect()
                return data
            except Exception as e:
                logger.error(f"Mikrotik API error (get_bridge_host): {e}", exc_info=True)
                return []
        return await asyncio.to_thread(fetch)

    async def get_neighbors(self) -> List[Dict[str, Any]]:
        """Pobiera listę sąsiadów wykrytych przez protokoły discovery (MNDP, LLDP, CDP)."""
        def fetch():
            try:
                conn, api = self._get_api()
                data = api.get_resource('/ip/neighbor').get()
                conn.disconnect()
                return data
            except Exception as e:
                logger.error(f"Mikrotik API error (get_neighbors): {e}", exc_info=True)
                return []
        return await asyncio.to_thread(fetch)

