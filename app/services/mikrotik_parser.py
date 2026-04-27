import re

# Mapowanie skrótów ulic na pełne nazwy w systemie CRM
SUFFIX_MAP = {
    "kos": "Romana Kosely",
    "kro": "Tadeusza Króla",
    "mic": "Adama Mickiewicza",
    "mac": "Ignacego Maciejowskiego",
    "mil": "Milberta",
    "sch": "Schinzla",
    "cie": "ul. Cieśli",
    "slo": "ul. Słowackiego",
    "chwa": "os. Chwałki",
    "ak": "Armii Krajowej"
}

def parse_mikrotik_comment(comment: str):
    """
    Parsuje komentarz w formacie: "1825 Krupka M/33 Mic25"
    Zwraca słownik ze strukturalnymi danymi lub None jeśli format nie pasuje.
    """
    if not comment:
        return None
        
    # Regex Breakdown:
    # (\d+)      -> ID (np. 1825) - ignorowane
    # ([^\s]+)   -> Nazwisko (np. Krupka)
    # M/(\d+)    -> Numer lokalu (np. 33)
    # ([a-zA-Z]+)-> Skrót ulicy (np. Mic)
    # (\d+)      -> Numer budynku (np. 25)
    pattern = r"(\d+)\s+([^\s]+)\s+M/(\d+)\s+([A-Za-z]+)(\d+)"
    match = re.search(pattern, comment, re.IGNORECASE)
    
    if not match:
        return None
        
    suffix = match.group(4).lower()
    full_street = SUFFIX_MAP.get(suffix, match.group(4)) # Fallback do skrótu jeśli brak w mapie
    
    return {
        "external_id": match.group(1),
        "last_name": match.group(2),
        "apartment_number": match.group(3),
        "street_name": full_street,
        "street_number": match.group(5)
    }
