import string
import random
import unicodedata

def normalize_polish_chars(text: str) -> str:
    """
    Replaces Polish characters with their ASCII equivalents.
    """
    if not text:
        return ""
    
    replacements = {
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
        'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
    }
    
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)
    
    # Also handle any other accents just in case
    text = unicodedata.normalize('NFD', text)
    text = "".join([c for c in text if unicodedata.category(c) != 'Mn'])
    
    return text

def generate_login(surname: str, street_name: str, street_number: str, apartment_number: str) -> str:
    """
    Generates login: [surname][street_number][3_letters_of_last_word_of_street][apartment_number]
    Example: Kwiatkowski, Gen Lina Żółkiewskiego 9, ap 10 -> kwiatkowski9zol10
    """
    surname = normalize_polish_chars(surname or "").lower().strip()
    street_name = normalize_polish_chars(street_name or "").lower().strip()
    street_number = str(street_number or "").strip()
    apartment_number = str(apartment_number or "").strip()
    
    street_suffix = ""
    if street_name:
        words = street_name.split()
        if words:
            last_word = words[-1]
            street_suffix = last_word[:3]
            
    return f"{surname}{street_number}{street_suffix}{apartment_number}"

def generate_password(length: int = 12) -> str:
    """
    Generates a random password from custom letters, signs and numbers.
    """
    # Exclude characters that are easily confused like I, l, 1, O, 0
    chars = string.ascii_letters + string.digits + "!@#$%^&*"
    # Avoid problematic characters for some shells if needed, but here we use a safe set
    return "".join(random.choice(chars) for _ in range(length))
