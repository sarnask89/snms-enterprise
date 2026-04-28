import httpx
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger("app.gugik")

class GugikGeocodingService:
    """Service for authoritative Polish geocoding using GUGiK (Geoportal)."""
    
    # Universal Geocoding Service (UUG)
    UUG_URL = "https://services.gugik.gov.pl/uug/"
    
    # Official GUGiK API for PUWG 1992 coordinates
    GUGIK_BASE_URL = "https://services.gugik.gov.pl/uug/" # UUG endpoint also supports GetAddress

    async def geocode_address(self, city: str, street: str, number: str) -> Optional[Dict[str, float]]:
        """
        Geocodes a Polish address to Latitude and Longitude (WGS84).
        """
        if not all([city, street, number]):
            return None
            
        address_str = f"{city}, {street} {number}"
        params = {
            "request": "getaddress",
            "address": address_str
        }
        
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(self.UUG_URL, params=params, timeout=10.0)
                resp.raise_for_status()
                data = resp.json()
                
                if data and "results" in data and data["results"]:
                    # Get first match
                    first_key = list(data["results"].keys())[0]
                    best_match = data["results"][first_key]
                    
                    x = float(best_match.get("x", 0))
                    y = float(best_match.get("y", 0))
                    
                    # For Poland, Lat (X) is ~52, Lon (Y) is ~21
                    return {
                        "lat": x if x > y else y,
                        "lon": y if x > y else x
                    }
        except Exception as e:
            logger.error(f"GUGiK WGS84 geocoding failed for {address_str}: {e}")
            
        return None

    async def get_coordinates_for_pit_uke(self, simc: str, ulic: str, number: str) -> Optional[Dict[str, Any]]:
        """
        Pobiera współrzędne w układzie PUWG 1992 (EPSG:2180) pod system PIT UKE.
        Uses the structured ID format: simc_ulic_number
        """
        address_id = f"{simc}_{ulic}_{number}"
        params = {
            "request": "GetAddress",
            "id": address_id,
            "srid": 2180
        }
        
        try:
            async with httpx.AsyncClient() as client:
                # Note: The provided snippet used gugik.gov.pl, but official UUG is services.gugik.gov.pl
                resp = await client.get(self.UUG_URL, params=params, timeout=10.0)
                if resp.status_code == 200:
                    lines = resp.text.splitlines()
                    if lines and lines[0] == '0' and len(lines) > 1:
                        # Format: id|X|Y
                        data = lines[1].split('|')
                        return {
                            "X_1992": data[1],
                            "Y_1992": data[2],
                            "EPSG": "2180"
                        }
        except Exception as e:
            logger.error(f"GUGIK PIT/UKE (EPSG:2180) lookup failed for {address_id}: {e}")
            
        return None
