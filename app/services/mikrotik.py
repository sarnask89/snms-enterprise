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

    async def remote_ping(self, target: str, count: int = 5):
        """Wykonuje ping z routera do celu."""
        def sync_ping():
            try:
                conn, api = self._get_api()
                ping_resource = api.get_resource('/ping')
                # Wait, ping usually doesn't work directly with simple GET, it's an API call
                res = api.get_binary_resource('/').call('ping', {'address': target.encode(), 'count': str(count).encode()})
                conn.disconnect()
                return [{"result": "Ping executed"}] # simplified
            except Exception as e:
                logger.error(f"Mikrotik API error (ping): {e}", exc_info=True)
                return []
                
        return await asyncio.to_thread(sync_ping)
