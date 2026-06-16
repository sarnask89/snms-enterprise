import httpx
import logging
from typing import Optional, Dict

logger = logging.getLogger("app.geocoding")

class GeocodingService:
    """Service for address geocoding using Nominatim (OpenStreetMap)."""
    
    BASE_URL = "https://nominatim.openstreetmap.org/search"
    USER_AGENT = "SNMS-Enterprise-CRM/1.0"

    async def geocode_address(self, city: str, street: str, number: str) -> Optional[Dict[str, float]]:
        """
        Geocodes a Polish address to Latitude and Longitude.
        Returns a dict with 'lat' and 'lon' or None if not found.
        """
        if not all([city, street, number]):
            return None
            
        params = {
            "format": "json",
            "q": f"{street} {number}, {city}, Polska",
            "limit": 1
        }
        headers = {
            "User-Agent": self.USER_AGENT,
            "Accept-Language": "pl"
        }
        
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(self.BASE_URL, params=params, headers=headers, timeout=10.0)
                resp.raise_for_status()
                data = resp.json()
                
                if data and len(data) > 0:
                    return {
                        "lat": float(data[0]["lat"]),
                        "lon": float(data[0]["lon"])
                    }
        except Exception as e:
            logger.error(f"Geocoding failed for {params['q']}: {e}")
            
        return None
