import httpx
import logging
from typing import List, Dict, Any
from app import models

logger = logging.getLogger(__name__)

class MikrotikService:
    def __init__(self, host: str, user: str, password: str, port: int = 443):
        self.base_url = f"https://{host}:{port}/rest"
        self.auth = (user, password)
        self.client_kwargs = {
            "auth": self.auth,
            "verify": False, # Mikrotik często używa self-signed certs
            "timeout": 10.0
        }

    async def get_leases(self) -> List[Dict[str, Any]]:
        """Pobiera listę wszystkich dzierżaw DHCP."""
        async with httpx.AsyncClient(**self.client_kwargs) as client:
            try:
                resp = client.get(f"{self.base_url}/ip/dhcp-server/lease")
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                logger.error(f"Mikrotik API error (get_leases): {e}")
                return []

    async def upsert_static_lease(self, mac: str, address: str, comment: str, rate_limit: str = None):
        """Dodaje lub aktualizuje statyczną dzierżawę DHCP z ograniczeniem prędkości."""
        async with httpx.AsyncClient(**self.client_kwargs) as client:
            try:
                # 1. Sprawdź czy istnieje
                resp = await client.get(f"{self.base_url}/ip/dhcp-server/lease?mac-address={mac}")
                existing = resp.json()
                
                payload = {
                    "mac-address": mac,
                    "address": address,
                    "comment": comment,
                }
                if rate_limit:
                    payload["rate-limit"] = rate_limit

                if existing:
                    # Update
                    lease_id = existing[0][".id"]
                    resp = await client.patch(f"{self.base_url}/ip/dhcp-server/lease/{lease_id}", json=payload)
                else:
                    # Create
                    resp = await client.put(f"{self.base_url}/ip/dhcp-server/lease", json=payload)
                
                resp.raise_for_status()
                return True, resp.json()
            except Exception as e:
                logger.error(f"Mikrotik API error (upsert_lease): {e}")
                return False, str(e)

    async def remote_ping(self, target: str, count: int = 5):
        """Wykonuje ping z routera do celu."""
        async with httpx.AsyncClient(**self.client_kwargs) as client:
            try:
                resp = await client.post(
                    f"{self.base_url}/ping", 
                    json={"address": target, "count": count}
                )
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                logger.error(f"Mikrotik API error (ping): {e}")
                return []
