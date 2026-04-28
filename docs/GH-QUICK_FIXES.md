# SNMS Enterprise - Quick Fixes (Immediately Actionable)

**Priority**: These can be implemented TODAY  
**Estimated Time**: 2-4 hours total

---

## 1. FIX: Remove Hardcoded Encryption Key

**File**: `app/config.py`

**Current** (Lines 20-21):
```python
# Key for encrypting device management passwords (must be 32 url-safe base64-encoded bytes)
CRM_ENCRYPTION_KEY = os.environ.get("CRM_ENCRYPTION_KEY", "7T-zN-Wf3k7VzYxZ-gH1R9_Y7m6_Z8x1Y2_X3z4v5w6=")
```

**Replace with**:
```python
# Key for encrypting device management passwords (must be 32 url-safe base64-encoded bytes)
_encryption_key = os.environ.get("CRM_ENCRYPTION_KEY")
if not _encryption_key:
    error_msg = (
        "ERROR: CRM_ENCRYPTION_KEY not configured!\n"
        "Generate a new key with:\n"
        "  python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())'\n"
        "Then set it in .env: CRM_ENCRYPTION_KEY=<generated_key>"
    )
    raise ConfigError(error_msg)
CRM_ENCRYPTION_KEY = _encryption_key

# At startup, validate key format
try:
    from cryptography.fernet import Fernet
    Fernet(_encryption_key.encode())
except Exception as e:
    raise ConfigError(f"Invalid CRM_ENCRYPTION_KEY format: {e}")
```

**Effort**: 5 minutes

---

## 2. FIX: Enforce Strong Admin Password

**File**: `app/config.py`

**Current** (Lines 19-20):
```python
CRM_ADMIN_USER = os.environ.get("CRM_ADMIN_USER", "admin")
CRM_ADMIN_PASSWORD = os.environ.get("CRM_ADMIN_PASSWORD", "test")
```

**Replace with**:
```python
CRM_ADMIN_USER = os.environ.get("CRM_ADMIN_USER", "admin").strip()

_admin_password = os.environ.get("CRM_ADMIN_PASSWORD", "").strip()
if not _admin_password or _admin_password == "test":
    error_msg = (
        "ERROR: CRM_ADMIN_PASSWORD not configured!\n"
        "Set CRM_ADMIN_PASSWORD in .env to a strong password:\n"
        "  CRM_ADMIN_PASSWORD=YourSecurePassword123!@#"
    )
    if os.environ.get("ENVIRONMENT") == "production":
        raise ConfigError(error_msg)
    else:
        logger.warning(error_msg + "\n(Running in development mode)")
        _admin_password = secrets.token_urlsafe(16)
        logger.info(f"Generated temporary password for development: {_admin_password}")

CRM_ADMIN_PASSWORD = _admin_password

# Validate password strength
def _validate_password_strength(pwd: str) -> bool:
    """Ensure password meets minimum requirements."""
    if len(pwd) < 8:
        return False
    has_upper = any(c.isupper() for c in pwd)
    has_lower = any(c.islower() for c in pwd)
    has_digit = any(c.isdigit() for c in pwd)
    return has_upper and has_lower and has_digit

if os.environ.get("ENVIRONMENT") == "production" and not _validate_password_strength(CRM_ADMIN_PASSWORD):
    raise ConfigError(
        "Admin password must be at least 8 characters with uppercase, lowercase, and digits"
    )
```

**Add to imports** (top of file):
```python
import secrets
from app.exceptions import ConfigError
```

**Effort**: 10 minutes

---

## 3. FIX: Validate TERYT Credentials at Startup

**File**: `app/init_db.py`

**Add to `init_all()` function** (around line 120):
```python
def init_all() -> None:
    """Initialize database and validate external services."""
    # ... existing code ...
    
    # Validate TERYT WS credentials
    if os.environ.get("TERYT_WS_USER") and os.environ.get("TERYT_WS_PASSWORD"):
        try:
            from app.teryt_ws import czy_zalogowany
            if czy_zalogowany():
                logger.info("✓ TERYT WS connection verified")
            else:
                logger.warning("⚠ TERYT WS credentials invalid - address search may fail")
        except Exception as e:
            logger.warning(f"⚠ TERYT WS unreachable: {e}")
    else:
        logger.info("ℹ TERYT WS not configured (optional)")
```

**Effort**: 5 minutes

---

## 4. FIX: Create Safe Integer Parsing Utility

**New File**: `app/utils/parsing.py`

```python
"""Safe parsing utilities for form inputs."""

from fastapi import HTTPException, status


def parse_int(value: str | None, field_name: str = "parameter") -> int:
    """
    Parse string to integer safely, raising 400 Bad Request on invalid input.
    
    Args:
        value: String value to parse
        field_name: Name of field for error message
    
    Returns:
        Parsed integer value
    
    Raises:
        HTTPException: 400 Bad Request if value is invalid
    """
    if not value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field_name} is required"
        )
    
    try:
        return int(str(value).strip())
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field_name} must be a valid integer"
        )


def parse_int_optional(value: str | None) -> int | None:
    """Parse optional integer, returning None if empty."""
    if not value or not str(value).strip():
        return None
    
    try:
        return int(str(value).strip())
    except (ValueError, TypeError):
        return None
```

**Usage Example**:
```python
# OLD (error-prone)
cid = int(customer_id) if customer_id and str(customer_id).strip().isdigit() else None

# NEW (safe)
from app.utils.parsing import parse_int_optional
cid = parse_int_optional(customer_id)
```

**Add to**: `app/utils/__init__.py`
```python
from app.utils.parsing import parse_int, parse_int_optional

__all__ = ["parse_int", "parse_int_optional"]
```

**Effort**: 10 minutes

---

## 5. FIX: Remove Hardcoded SECRET_KEY Default

**File**: `app/config.py`

**Current** (Line 22):
```python
SECRET_KEY = os.environ.get("CRM_SECRET_KEY", "change-me-in-production-use-long-random")
```

**Replace with**:
```python
_secret_key = os.environ.get("CRM_SECRET_KEY")
if not _secret_key:
    if os.environ.get("ENVIRONMENT") == "production":
        raise ConfigError("CRM_SECRET_KEY must be set in production")
    
    # Generate random key for development
    _secret_key = secrets.token_urlsafe(32)
    logger.warning(
        f"Generated temporary SECRET_KEY for development: {_secret_key}\n"
        "Set CRM_SECRET_KEY env var for persistent sessions across restarts"
    )
elif len(_secret_key) < 16:
    logger.warning("WARNING: CRM_SECRET_KEY is short (< 16 chars). Should be at least 32 chars.")

SECRET_KEY = _secret_key
```

**Effort**: 5 minutes

---

## 6. FIX: Add Timeout to Mikrotik Service

**File**: `app/services/mikrotik.py`

**Find ALL async functions** and add timeout:

**OLD**:
```python
async def get_leases(self) -> List[Dict[str, Any]]:
    def fetch():
        # ...
    return await asyncio.to_thread(fetch)
```

**NEW**:
```python
async def get_leases(self) -> List[Dict[str, Any]]:
    def fetch():
        conn = None
        try:
            conn, api = self._get_api()
            leases_resource = api.get_resource('/ip/dhcp-server/lease')
            data = leases_resource.get()
            logger.info(f"Mikrotik: Returned {len(data)} leases")
            return data
        finally:
            if conn:
                try:
                    conn.disconnect()
                except:
                    pass  # Ignore disconnect errors
    
    try:
        return await asyncio.wait_for(
            asyncio.to_thread(fetch),
            timeout=30.0  # 30 second timeout
        )
    except asyncio.TimeoutError:
        logger.error(f"Mikrotik timeout on {self.host}:{self.port}")
        return []
    except Exception as e:
        logger.error(f"Mikrotik error: {e}", exc_info=True)
        return []
```

**Apply to all methods**:
- `get_leases()`
- `upsert_static_lease()`
- `remote_ping()`
- `remote_arp_ping()`
- `get_lease_info()`
- `get_bridge_host_info()`

**Effort**: 20 minutes

---

## 7. FIX: Improve Error Handling in Helpdesk

**File**: `app/routers/helpdesk.py` (Line 244-245)

**OLD**:
```python
except Exception as e:
    raise e
```

**NEW**:
```python
except IntegrityError:
    logger.warning(f"Duplicate key when creating ticket")
    raise HTTPException(
        status_code=409,
        detail="Ticket with this ID already exists"
    )
except SQLAlchemyError as e:
    logger.error(f"Database error creating ticket: {e}", exc_info=True)
    raise HTTPException(
        status_code=500,
        detail="Failed to create ticket"
    )
except Exception as e:
    logger.error(f"Unexpected error creating ticket: {e}", exc_info=True)
    raise HTTPException(
        status_code=500,
        detail="Internal server error"
    )
```

**Add imports**:
```python
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
```

**Effort**: 10 minutes

---

## 8. FIX: Add Domain Validation

**File**: `app/routers/snms_entities.py`

**Create validation function** (in hosting_new_submit, line 134):

**Before**:
```python
domain=(domain or None) and domain.strip()[:255] or None,
```

**After**:
```python
# Validate domain format
domain_value = None
if domain:
    domain = domain.strip()[:255]
    # Basic domain validation - alphanumeric, dots, hyphens
    import re
    if domain and not re.match(r'^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$', domain):
        raise HTTPException(status_code=400, detail="Invalid domain format")
    domain_value = domain
```

**Apply to**:
- `hosting_new_submit()` - lines around 134
- `hosting_edit_submit()` - lines around 177

**Effort**: 10 minutes

---

## 9. FIX: Sanitize Rate Limit Parsing

**File**: `app/routers/network_discovery.py` (line 44)

**Add validation**:
```python
def _parse_rate_limit(rl: str | None) -> tuple[int | None, int | None]:
    """Parse Mikrotik 'rx/tx' format to (tx_mbps, rx_mbps)."""
    if not rl or "/" not in rl:
        return None, None
    
    try:
        parts = rl.split("/")
        if len(parts) != 2:
            return None, None
        
        def to_mbps(val: str) -> int:
            val = val.lower().strip()
            
            # Remove suffix (k, m, g)
            multiplier = 1
            if val.endswith('m'):
                multiplier = 1
            elif val.endswith('k'):
                multiplier = 0.001
            elif val.endswith('g'):
                multiplier = 1000
            else:
                # No suffix, assume already in Mbps
                pass
            
            # Parse number
            num_str = val.rstrip('kmg')
            num = float(num_str)
            
            # Apply multiplier and bounds check
            result = int(num * multiplier)
            if result > 10000:  # Max 10 Gbps
                raise ValueError(f"Rate limit too high: {result} Mbps")
            
            return result
        
        tx = to_mbps(parts[0])
        rx = to_mbps(parts[1])
        return tx, rx
        
    except (ValueError, IndexError, AttributeError):
        logger.warning(f"Failed to parse rate limit: {rl}")
        return None, None
```

**Effort**: 15 minutes

---

## 10. FIX: Add .env Validation on Startup

**New File**: `app/config_validation.py`

```python
"""Validate critical configuration at startup."""

import os
import sys
from app.config import (
    CRM_ENCRYPTION_KEY, 
    CRM_ADMIN_PASSWORD,
    SECRET_KEY,
    TERYT_WS_USER,
    TERYT_WS_PASSWORD
)


def validate_environment() -> list[str]:
    """
    Validate all critical configuration.
    
    Returns:
        List of warning messages (empty if all OK)
    """
    warnings = []
    
    # Check encryption key
    if not CRM_ENCRYPTION_KEY or len(CRM_ENCRYPTION_KEY) < 32:
        warnings.append("❌ CRITICAL: CRM_ENCRYPTION_KEY not properly configured")
    
    # Check admin password
    if not CRM_ADMIN_PASSWORD or len(CRM_ADMIN_PASSWORD) < 8:
        warnings.append("❌ CRITICAL: CRM_ADMIN_PASSWORD must be at least 8 characters")
    
    # Check secret key
    if not SECRET_KEY or len(SECRET_KEY) < 16:
        warnings.append("⚠️  WARNING: SECRET_KEY should be at least 16 characters")
    
    # Check TERYT config
    if not TERYT_WS_USER or not TERYT_WS_PASSWORD:
        warnings.append("ℹ️  INFO: TERYT WS not configured (optional - address search disabled)")
    
    return warnings


def report_configuration() -> None:
    """Print configuration report at startup."""
    print("\n" + "="*60)
    print("SNMS Configuration Report")
    print("="*60)
    
    warnings = validate_environment()
    
    if warnings:
        for warning in warnings:
            print(warning)
        print()
    
    print(f"✓ Environment: {os.environ.get('ENVIRONMENT', 'development')}")
    print(f"✓ Database: {os.environ.get('DATABASE_URL', 'SQLite (default)')[:50]}")
    print(f"✓ Static files: {os.environ.get('CRM_UPLOAD_ROOT', 'uploads (default)')}")
    print("="*60 + "\n")
    
    # Exit on critical errors in production
    critical_issues = [w for w in warnings if w.startswith("❌")]
    if critical_issues and os.environ.get("ENVIRONMENT") == "production":
        print("FATAL: Critical configuration issues in production!")
        sys.exit(1)


# Call in app/main.py lifespan:
@asynccontextmanager
async def lifespan(_app: FastAPI):
    from app.config_validation import report_configuration
    report_configuration()
    
    init_all()
    yield
```

**Effort**: 10 minutes

---

## Implementation Checklist

### Session 1 (1 hour)
- [ ] Fix hardcoded encryption key (5 min)
- [ ] Enforce admin password (10 min)
- [ ] Validate TERYT credentials at startup (5 min)
- [ ] Remove SECRET_KEY default (5 min)
- [ ] Create parsing utility (10 min)
- [ ] Add configuration validation (10 min)

### Session 2 (1.5 hours)
- [ ] Fix Mikrotik timeouts (20 min)
- [ ] Improve helpdesk error handling (10 min)
- [ ] Add domain validation (10 min)
- [ ] Sanitize rate limit parsing (15 min)
- [ ] Test changes (15 min)

### Session 3 (1 hour)
- [ ] Create .env.example with all required vars
- [ ] Update README with setup instructions
- [ ] Run security scanner (bandit)
- [ ] Commit and create PR

**Total Time**: ~3.5 hours for all quick fixes

---

## Testing These Fixes

```bash
# 1. Code style check
black app/
isort app/

# 2. Security scan
pip install bandit
bandit -r app/

# 3. Type check
pip install mypy
mypy app/ --ignore-missing-imports

# 4. Unit tests
pytest tests/ -v

# 5. Manual testing
uvicorn app.main:app --reload
# Test missing env vars
unset CRM_ENCRYPTION_KEY
# Should raise ConfigError on startup
```

---

**Creation Date**: 2026-04-28  
**Difficulty Level**: 🟢 Beginner - Intermediate  
**Testing Level**: 🟡 Medium - All changes should be tested
