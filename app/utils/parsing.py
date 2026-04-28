from typing import Optional, Any

def parse_int(value: Any, default: int = 0) -> int:
    """
    Safely parses a value to an integer. 
    Returns the default value if parsing fails or value is None.
    """
    if value is None:
        return default
    try:
        # Handle string stripping and potential float-like strings
        s = str(value).strip()
        if not s:
            return default
        # If there's a dot, it might be a string float "1.0", convert to float first
        if "." in s:
            return int(float(s))
        return int(s)
    except (ValueError, TypeError):
        return default

def parse_int_optional(value: Any) -> Optional[int]:
    """
    Safely parses a value to an integer.
    Returns None if parsing fails, value is None, or value is an empty string.
    """
    if value is None:
        return None
    try:
        s = str(value).strip()
        if not s:
            return None
        if "." in s:
            return int(float(s))
        return int(s)
    except (ValueError, TypeError):
        return None
