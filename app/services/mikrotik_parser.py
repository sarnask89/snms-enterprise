import re

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

# OPTIMIZATION: Compile regex at the module level to avoid recompiling it on every invocation.
_COMMENT_PATTERN = re.compile(
    r"(\d+)\s+([A-Za-zÀ-ÿ\-]+)\s+(?:(?:M/|m\.\s*|m)(\d+)\s+)?([A-Za-z]+)\s*(\d+[A-Za-z]?)",
    re.IGNORECASE
)

def parse_mikrotik_comment(comment: str):
    """
    Parsuje komentarz w formacie np.: "1825 Krupka M/33 Mic25" lub "1825 Kowalski Mic25"
    Zwraca słownik ze strukturalnymi danymi lub None jeśli format nie pasuje.
    """
    if not comment:
        return None
        
    comment = comment.strip()
    
    # OPTIMIZED: Use pre-compiled regex pattern instead of inline re.search with string pattern.
    match = _COMMENT_PATTERN.search(comment)
    
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
