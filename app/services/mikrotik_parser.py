import re
import logging
from sqlalchemy import select
from app import models

logger = logging.getLogger(__name__)

# Mapowanie skrótów ulic na pełne nazwy w systemie CRM
SUFFIX_MAP = {
    "kos": "Romana Koseły",
    "kro": "Tadeusza Króla",
    "krol": "Tadeusza Króla",
    "mic": "Adama Mickiewicza",
    "mac": "Ignacego Maciejowskiego",
    "mil": "Milberta",
    "sch": "Schinzla",
    "cie": "Cieśli",
    "slo": "Słowackiego",
    "chwa": "os. Chwałki",
    "ak": "Armii Krajowej",
    "pils": "Piłsudskiego",
    "kier": "Kierzkowska",
    "krak": "Krakowska",
    "m": "Mickiewicza",
    "zar": "Zarzekowice",
    "zam": "Zamkowa",
    "obr": "Obrońców",
    "zol": "Żółkiewskiego",
}

# Cache dictionary to store street_name.lower() -> street_id
_STREET_CACHE = {}

def clear_street_cache():
    """Clears the cached street names. Useful for testing."""
    _STREET_CACHE.clear()

def match_street_name(db, street_name: str) -> int | None:
    """
    Optimized and cached street name lookup to completely eliminate N+1 database queries.
    Saves street ID (int) instead of model objects to prevent DetachedInstanceErrors.
    """
    if not street_name:
        return None

    normalized_name = street_name.strip().lower()
    if normalized_name in _STREET_CACHE:
        return _STREET_CACHE[normalized_name]

    # If cache is empty, preload all streets in one single batch query
    if not _STREET_CACHE:
        try:
            streets = db.scalars(select(models.LocationStreet)).all()
            for street in streets:
                _STREET_CACHE[street.name.strip().lower()] = street.id
        except Exception as e:
            logger.error(f"Error preloading streets to cache: {e}")

    # Try exact match first
    street_id = _STREET_CACHE.get(normalized_name)
    if street_id is not None:
        return street_id

    # Try substring match
    for name, s_id in _STREET_CACHE.items():
        if normalized_name in name or name in normalized_name:
            _STREET_CACHE[normalized_name] = s_id
            return s_id

    # Try database fallback with ILIKE as a last resort
    try:
        street = db.scalar(
            select(models.LocationStreet)
            .where(models.LocationStreet.name.ilike(f"%{street_name}%"))
        )
        if street:
            _STREET_CACHE[normalized_name] = street.id
            return street.id
    except Exception as e:
        logger.error(f"Error matching street name in db fallback: {e}")

    return None

def parse_mikrotik_comment(comment: str):
    """
    Parsuje komentarz w formacie np.: "1825 Krupka M/33 Mic25" lub "1825 Kowalski Mic25"
    Zwraca słownik ze strukturalnymi danymi lub None jeśli format nie pasuje.
    """
    if not comment:
        return None
        
    comment = comment.strip()
    
    # Bardziej liberalny pattern:
    # 1. (\d+) - ID
    # 2. ([A-Za-zÀ-ÿ\-]+) - Nazwisko
    # 3. (?:(?:M/|m\.\s*|m)(\d+)\s+)? - Opcjonalny numer lokalu
    # 4. ([A-Za-z]+)\s*(\d+[A-Za-z]?) - Skrót ulicy i numer budynku
    pattern = r"(\d+)\s+([A-Za-zÀ-ÿ\-]+)\s+(?:(?:M/|m\.\s*|m)(\d+)\s+)?([A-Za-z]+)\s*(\d+[A-Za-z]?)"
    match = re.search(pattern, comment, re.IGNORECASE)
    
    if not match:
        return None
        
    shortcut = match.group(4).lower()
    full_street = SUFFIX_MAP.get(shortcut, match.group(4)) # Fallback do skrótu
    
    return {
        "external_id": match.group(1),
        "last_name": match.group(2).title(),
        "apartment_number": match.group(3) if match.group(3) else "",
        "street_name": full_street,
        "street_number": match.group(5).upper()
    }
