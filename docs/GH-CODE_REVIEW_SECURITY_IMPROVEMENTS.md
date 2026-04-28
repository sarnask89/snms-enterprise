# SNMS Enterprise - Code Review & Security Analysis

**Date**: April 28, 2026  
**Project**: CRM Portal (FastAPI + SQLAlchemy)  
**Scope**: Error analysis, security review, and proposed improvements

---

## Executive Summary

The SNMS Enterprise application is a well-structured FastAPI CRM with comprehensive modules for customer management, network devices, finances, and helpdesk. However, several security concerns, error handling gaps, and code quality improvements have been identified.

**Critical Issues**: 3  
**High-Priority Issues**: 7  
**Medium-Priority Issues**: 12  
**Nice-to-Have Improvements**: 10

---

## 🔴 CRITICAL ISSUES

### 1. **Hardcoded Encryption Key in Configuration** ⚠️
**File**: `app/config.py` (line 21)  
**Severity**: CRITICAL

```python
CRM_ENCRYPTION_KEY = os.environ.get("CRM_ENCRYPTION_KEY", "7T-zN-Wf3k7VzYxZ-gH1R9_Y7m6_Z8x1Y2_X3z4v5w6=")
```

**Issues**:
- Default encryption key is publicly visible in repository
- Same key used for all installations 
- Device passwords encrypted with this key are compromised by default

**Risk**: Attackers can decrypt all device management passwords without effort.

**Recommendation**:
```python
# app/config.py
CRM_ENCRYPTION_KEY = os.environ.get("CRM_ENCRYPTION_KEY")
if not CRM_ENCRYPTION_KEY:
    raise ConfigError(
        "CRM_ENCRYPTION_KEY not set. Generate with: "
        "python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())'"
    )
```

**Fix Priority**: Implement immediately before production use.

---

### 2. **Plaintext Default Admin Credentials** ⚠️
**File**: `app/config.py` (lines 19-20)  
**Severity**: CRITICAL

```python
CRM_ADMIN_USER = os.environ.get("CRM_ADMIN_USER", "admin")
CRM_ADMIN_PASSWORD = os.environ.get("CRM_ADMIN_PASSWORD", "test")
```

**Issues**:
- Documented default credentials (`admin/test`) known to all developers
- No enforcement to change credentials on first login
- No password complexity requirements

**Risk**: Default credentials provide direct unauthorized access.

**Recommendation**:
```python
# app/config.py
if not os.environ.get("CRM_ADMIN_PASSWORD") or os.environ.get("CRM_ADMIN_PASSWORD") == "test":
    raise ConfigError(
        "Default admin password detected. Set CRM_ADMIN_PASSWORD to a strong password."
    )

# Implement forced password change on first login
# Add password complexity validation: min 12 chars, uppercase, lowercase, digits, symbols
```

---

### 3. **Missing TERYT Credential Validation at Startup** ⚠️
**File**: `app/teryt_ws.py` (lines 30-35)  
**Severity**: CRITICAL

```python
def _client() -> Client:
    if not TERYT_WS_USER or not TERYT_WS_PASSWORD:
        raise TerytWsConfigError("Brak poświadczeń TERYT.")
    try:
        return Client(TERYT_WS_WSDL, wsse=UsernameToken(TERYT_WS_USER, TERYT_WS_PASSWORD))
    except Exception as e:
        logger.error(f"Failed to initialize TERYT client: {e}")
        raise
```

**Issues**:
- TERYT credentials validated only when API is first called
- Application starts successfully even without valid TERYT credentials
- No startup validation in `app/init_db.py`

**Risk**: Address validation fails in production without warning.

**Recommendation**:
```python
# app/init_db.py - add to lifespan
def init_all():
    """Initialize all critical services."""
    from app.teryt_ws import czy_zalogowany
    
    if not czy_zalogowany():
        logger.warning("TERYT WS credentials invalid or unreachable. Address search will fail.")
        # Decide: fail startup or warn?
```

---

## 🟠 HIGH-PRIORITY ISSUES

### 4. **Inconsistent Error Handling in Database Operations**
**File**: Multiple router files  
**Severity**: HIGH

**Pattern Found**:
```python
# app/routers/snms_entities.py:244
except Exception as e:
    raise  # Generic re-raise, no context

# app/routers/helpdesk.py:244
except Exception as e:
    raise e  # Same issue
```

**Issues**:
- `except Exception` catches too broadly (includes SystemExit, KeyboardInterrupt)
- No context about which resource/operation failed
- No logging before re-raise

**Recommendation**:
```python
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

try:
    db.add(item)
    db.flush()
except IntegrityError:
    logger.warning(f"Duplicate key for {resource_type}: {details}")
    raise HTTPException(status_code=409, detail="Records already exists")
except SQLAlchemyError as e:
    logger.error(f"Database error while creating {resource_type}: {e}", exc_info=True)
    raise HTTPException(status_code=500, detail="Database operation failed")
```

**Files to update**:
- `app/routers/snms_entities.py` (lines 244-245)
- `app/routers/helpdesk.py` (lines 244-245)
- `app/routers/netdevices.py` (line 23)
- `app/routers/ip_networks.py` (line 95)

---

### 5. **Unvalidated Integer Conversion in URL Parameters**
**File**: `app/routers/snms_entities.py` (line 21)  
**Severity**: HIGH

```python
cid = int(customer_id) if customer_id and str(customer_id).strip().isdigit() else None
```

**Issues**:
- `int()` conversion can raise exception
- This pattern repeated 30+ times across routers
- No explicit HTTP 400 response for invalid IDs

**Risk**: Invalid IDs cause unhandled 500 errors instead of 400 Bad Request.

**Recommendation** - Create utility function:
```python
# app/utils.py
def safe_int(value: str | None) -> int | None:
    """Convert string to int safely, returning None on invalid input."""
    if not value:
        return None
    try:
        return int(str(value).strip())
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid integer: {value}")
```

---

### 6. **SQL Injection Risk in Dynamic Queries**
**File**: `app/routers/customers.py` (line 37)  
**Severity**: HIGH

```python
if q and q.strip():
    term = f"%{q.strip()}%"
    stmt = stmt.where(or_(
        models.Customer.customer_code.ilike(term),
        models.Customer.last_name.ilike(term),
        models.Customer.email.ilike(term)
    ))
```

**Status**: ✅ Actually SAFE - SQLAlchemy ORM parameterizes queries automatically.

**But**: Code style doesn't make this obvious. Consider explicit parameterization for clarity:
```python
# Already safe, but more explicit:
search_term = f"%{q.strip()}%"  # Still parameterized by SQLAlchemy
```

---

### 7. **Missing Async/Await Transaction Handling in Services**
**File**: `app/services/mikrotik.py` (line 37)  
**Severity**: HIGH

```python
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
```

**Issues**:
- Nested function in async method reduces readability
- No timeout on `asyncio.to_thread()` - could hang indefinitely
- On error, silently returns [] - caller can't distinguish failure from empty result
- Connection not guaranteed to disconnect on exception

**Recommendation**:
```python
async def get_leases(self) -> tuple[bool, list]:
    """Returns (success, data) tuple."""
    try:
        def fetch():
            conn = None
            try:
                conn, api = self._get_api()
                leases_resource = api.get_resource('/ip/dhcp-server/lease')
                data = leases_resource.get()
                logger.info(f"Mikrotik: Zwrócono {len(data)} dzierżaw")
                return data
            finally:
                if conn:
                    conn.disconnect()
        
        result = await asyncio.wait_for(asyncio.to_thread(fetch), timeout=30.0)
        return True, result
    except asyncio.TimeoutError:
        logger.error(f"Mikrotik timeout on {self.host}")
        return False, []
    except Exception as e:
        logger.error(f"Mikrotik error: {e}")
        return False, []
```

---

### 8. **DASAN Service - Network Error Not Handled**
**File**: `app/services/dasan.py` (line 40)  
**Severity**: HIGH

```python
def get_onu_path(self, mac_address: str) -> Dict[str, Any]:
    """Lokalizuje ONU na OLT na podstawie adresu MAC."""
    try:
        with ConnectHandler(**self.device) as ssh:
            cmd = f"show gpon onu mac-address | include {mac_address}"
            output = ssh.send_command(cmd)
            # ... regex parsing
    except Exception as e:
        logger.error(f"DASAN SSH error: {e}")
        return {"error": str(e)}
```

**Issues**:
- SSH command includes unescaped MAC address (command injection risk if MAC comes from user)
- No timeout on SSH connection
- Error object might contain sensitive connection details
- Caller can't distinguish "MAC not found" from "connection failed"

**Recommendation**:
```python
def get_onu_path(self, mac_address: str) -> Dict[str, Any]:
    """Returns {status: 'success'|'not_found'|'error', ...}."""
    # Validate MAC format first
    if not re.match(r'^([0-9a-fA-F]{2}:){5}([0-9a-fA-F]{2})$', mac_address):
        return {"status": "error", "detail": "Invalid MAC format"}
    
    try:
        with ConnectHandler(**self.device, timeout=15) as ssh:
            # Use shell escaping to prevent command injection
            cmd = f"show gpon onu mac-address | include {shlex.quote(mac_address)}"
            output = ssh.send_command(cmd)
            # ... parsing
    except ConnectAuthenticationException as e:
        logger.error(f"DASAN auth failed")
        return {"status": "error", "detail": "Authentication failed"}
    except (ConnectTimeoutException, SSHException) as e:
        logger.error(f"DASAN connection failed")
        return {"status": "error", "detail": "Network unreachable"}
    except Exception as e:
        logger.error(f"DASAN error: {e}", exc_info=True)
        return {"status": "error", "detail": "Unknown error"}
```

---

### 9. **Temporary Secret Key Default**
**File**: `app/config.py` (line 22)  
**Severity**: HIGH

```python
SECRET_KEY = os.environ.get("CRM_SECRET_KEY", "change-me-in-production-use-long-random")
```

**Issues**:
- Session secret is hardcoded and visible
- All development instances share same secret (sessions can be forged)
- No validation that key meets minimum length/entropy

**Recommendation**:
```python
SECRET_KEY = os.environ.get("CRM_SECRET_KEY")
if not SECRET_KEY or SECRET_KEY == "change-me-in-production-use-long-random":
    logger.warning("Using insecure default SECRET_KEY. Set CRM_SECRET_KEY environment variable.")
    # In production, raise error instead
    if os.environ.get("ENVIRONMENT") == "production":
        raise ConfigError("CRM_SECRET_KEY not configured for production")
    SECRET_KEY = secrets.token_urlsafe(32)
```

---

### 10. **Unhandled Exception in Geocoding Service**
**File**: `app/services/geocoding.py` (line 34)  
**Severity**: HIGH

```python
try:
    async with httpx.AsyncClient() as client:
        resp = await client.get(self.BASE_URL, params=params, headers=headers, timeout=10.0)
        resp.raise_for_status()
        data = resp.json()
        if data and len(data) > 0:
            return {"lat": float(data[0]["lat"]), "lon": float(data[0]["lon"])}
except Exception as e:
    logger.error(f"Geocoding failed for {params['q']}: {e}")
    
return None
```

**Issues**:
- `resp.json()` not wrapped in try-except (will raise JSONDecodeError)
- `float()` conversion can fail if data format is unexpected
- Timeout parameter type might need validation
- No retry logic for transient failures

**Recommendation**:
```python
try:
    async with httpx.AsyncClient() as client:
        resp = await client.get(self.BASE_URL, params=params, headers=headers, timeout=10.0)
        resp.raise_for_status()
        
        try:
            data = resp.json()
        except JSONDecodeError as e:
            logger.error(f"Invalid JSON from Nominatim: {e}")
            return None
            
        if not data or len(data) == 0:
            logger.debug(f"No geocoding results for {params['q']}")
            return None
        
        try:
            first = data[0]
            return {
                "lat": float(first.get("lat", 0)),
                "lon": float(first.get("lon", 0))
            }
        except (KeyError, ValueError, TypeError) as e:
            logger.error(f"Unexpected geocoding response format: {e}")
            return None
            
except httpx.TimeoutException:
    logger.warning(f"Geocoding timeout for {params['q']}")
    return None
except httpx.HTTPError as e:
    logger.error(f"Geocoding HTTP error: {e}")
    return None
```

---

## 🟡 MEDIUM-PRIORITY ISSUES

### 11. **Insecure String Concatenation in Logging**
**File**: Multiple routers  
**Severity**: MEDIUM

```python
# app/routers/snms_entities.py:76
record_audit(db, "create", resource_type="voip_account", resource_id=v.id, details=f"no: {v.phone_number}", request=request)
```

**Issues**:
- Phone numbers, email addresses logged in plaintext
- PII directly visible in audit logs
- No data redaction strategy

**Recommendation**:
```python
def mask_pii(value: str, pattern: str = "phone") -> str:
    """Mask Personal Identifiable Information."""
    if pattern == "phone" and len(value) >= 4:
        return f"***{value[-4:]}"
    if pattern == "email":
        parts = value.split('@')
        return f"{parts[0][0]}***@{parts[1]}" if '@' in value else "***"
    return "***"

# Usage:
record_audit(
    db, "create",
    resource_type="voip_account",
    resource_id=v.id,
    details=f"phone: {mask_pii(v.phone_number, 'phone')}",
    request=request
)
```

---

### 12. **Race Condition in Default Division Selection**
**File**: `app/routers/config_snms.py` (lines 42-43)  
**Severity**: MEDIUM

```python
if is_default in ("on", "true", "1", "yes"):
    for d in db.scalars(select(models.Division)).all():
        d.is_default = False  # ← Race condition if multiple requests concurrent
```

**Issues**:
- Non-atomic operation: multiple requests can set multiple defaults
- No locking mechanism
- No transaction isolation

**Recommendation**:
```python
if is_default in ("on", "true", "1", "yes"):
    # Use UPDATE statement instead of loop
    db.execute(
        update(models.Division).values(is_default=False)
    )
```

---

### 13. **Missing Validation on Custom Domain Input**
**File**: `app/routers/snms_entities.py` (line 155)  
**Severity**: MEDIUM

```python
domain=(domain or None) and domain.strip()[:255] or None,
```

**Issues**:
- No domain format validation
- No DNS lookup verification
- Accepts any string including special characters
- Potential XSS if rendered without escaping

**Recommendation**:
```python
import re
from urllib.parse import urlparse

def validate_domain(domain: str | None) -> str | None:
    """Validate domain format."""
    if not domain:
        return None
    domain = domain.strip()[:255]
    
    if not re.match(r'^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$', domain):
        raise HTTPException(status_code=400, detail="Invalid domain format")
    
    return domain
```

---

### 14. **Missing Input Validation for Network Numbers**
**File**: `app/routers/network_discovery.py` (lines 44-61)  
**Severity**: MEDIUM

```python
def _parse_rate_limit(rl: str | None) -> tuple[int | None, int | None]:
    """Parsuje format Mikrotik 'rx/tx' (upload/download) na (up_mbps, down_mbps)."""
    if not rl or "/" not in rl:
        return None, None
    
    try:
        def to_mbps(val: str) -> int:
            val = val.lower().strip()
            if 'm' in val:
                # ... parsing
```

**Issues**:
- Incomplete implementation shown
- No upper bound validation (could set rate_limit to infinite values)
- `m` suffix parsing could accept "M" or "MB" (ambiguous)

**Recommendation**: Add schema validation with ranges.

---

### 15. **Unencrypted Sensitive Data in Models**
**File**: `app/models.py` (entire file)  
**Severity**: MEDIUM

**Issues**:
- Device passwords not encrypted at rest (only when device settings stored)
- Phone numbers, emails stored plaintext
- No data classification

**Recommendation**:
```python
from sqlalchemy import String
from sqlalchemy.types import TypeDecorator
from app.security_utils import encrypt_password, decrypt_password

class EncryptedString(TypeDecorator):
    """String type that encrypts data at storage level."""
    impl = String
    cache_ok = True
    
    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        return encrypt_password(value)
    
    def process_result_value(self, value, dialect):
        if value is None:
            return value
        return decrypt_password(value)

# Usage:
class VoipAccount(Base):
    phone_number: Mapped[str] = mapped_column(EncryptedString(32), nullable=False)
```

---

### 16. **No Rate Limiting on Public APIs**
**File**: `app/routers/teryt.py` (line 86)  
**Severity**: MEDIUM

```python
@router.get("/teryt/browse", response_class=HTMLResponse)
def teryt_browse(request: Request):
    # ... no rate limiting
```

**Issues**:
- Public TERYT endpoints have no rate limiting
- Potential DDoS vector
- WS API calls are expensive (GUS API rate limited)

**Recommendation**:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.get("/teryt/browse", response_class=HTMLResponse)
@limiter.limit("30/minute")  # Rate limit public endpoints
def teryt_browse(request: Request):
    # ...
```

---

### 17. **Error Messages Leak Implementation Details**
**File**: `app/errors.py` (line 8)  
**Severity**: MEDIUM

```python
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    
    if _is_htmx(request):
        return _render_htmx_error(f"Serwer zwrócił błąd: {str(exc)}")  # ← Shows exception details
```

**Issues**:
- Production error page shows raw exception message
- Could reveal database schema, file paths, API endpoints
- Violates security best practices

**Recommendation**:
```python
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    user = getattr(request.state, "portal_user", None)
    is_admin = user and user.role == UserRole.admin
    
    if _is_htmx(request):
        message = f"Serwer zwrócił błąd: {str(exc)}" if is_admin else "Błąd serwera. Skontaktuj się z administracją."
        return _render_htmx_error(message)
```

---

### 18. **No CSRF Protection on State-Changing Operations**
**File**: All POST/DELETE endpoints  
**Severity**: MEDIUM

```python
@router.post("/voip/{row_id}/delete", dependencies=[Depends(require_business_write)])
def voip_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    # No CSRF token validation
```

**Issues**:
- Form submissions accept any origin
- Cross-site request forgery possible
- No double-submit cookies

**Recommendation**:
```python
from app.csrf import validate_csrf_token

@router.post("/voip/{row_id}/delete")
def voip_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    await validate_csrf_token(request)  # Ensure valid token
    # ...

# In HTML template:
<form method="post">
    <input type="hidden" name="csrf_token" value="{{ csrf_token }}">
    <!-- form fields -->
</form>
```

---

### 19. **Password Storage Without Proper Hashing**
**File**: `app/routers/auth.py`  
**Severity**: MEDIUM

**Issue**: Need to verify password hashing is properly implemented.

**Verification needed**: Check if `hash_password()` uses bcrypt with proper iterations.

---

### 20. **No Input Sanitization in Forms**
**File**: `app/routers/snms_entities.py` (multiple)  
**Severity**: MEDIUM

```python
label=label.strip()[:128],  # No sanitization
```

**Issues**:
- User input not sanitized for HTML/script injection
- Vulnerable if rendered without escaping in templates
- Jinja2 auto-escaping should help, but verify all templates use it

**Recommendation**:
```python
from markupsafe import escape

def sanitize_input(value: str | None, max_len: int = 255) -> str | None:
    """Sanitize user input."""
    if not value:
        return None
    # Strip whitespace
    value = str(value).strip()[:max_len]
    # Jinja2 will handle escaping on rendering, but be explicit in logging
    return value
```

---

### 21. **Database Transactions Not Properly Rolled Back**
**File**: `app/audit.py` (line 42)  
**Severity**: MEDIUM

```python
def record_audit(db: Session, ...):
    try:
        db.add(models.AuditLog(...))
    except Exception as e:
        logger.error(f"Failed to record audit log: {e}")
    # No commit/rollback here - relying on caller
```

**Issues**:
- Audit log failure silently ignored
- Caller might not know audit failed
- Transaction state unclear

**Recommendation**:
```python
def record_audit(db: Session, ...):
    """Record audit event. Raises if critical."""
    try:
        log_entry = models.AuditLog(...)
        db.add(log_entry)
        # Don't commit here - let caller control transaction scope
        db.flush()  # Ensure it's inserted
    except Exception as e:
        logger.error(f"Failed to record audit log: {e}")
        db.rollback()  # Ensure transaction isn't poisoned
        # Decide: raise or continue?
```

---

## 💡 NICE-TO-HAVE IMPROVEMENTS

### 22. **Pagination Not Implemented** 
Large result sets load all records into memory.

### 23. **No Query Result Caching**
Repeated TERYT/City queries hit database every time.

### 24. **Incomplete Test Coverage**
Test files exist but coverage is unknown.

### 25. **No Database Connection Pooling Configuration**
PostgreSQL connection handling could be optimized.

### 26. **Missing API Documentation**
OpenAPI endpoints not documented for integrations.

### 27. **No Structured Logging**
Logs are plain text - hard to parse/search in production.

### 28. **Missing Sentry/Error Tracking**
No centralized error monitoring.

### 29. **Incomplete Alembic Migration Support**
Version tracking not fully implemented.

### 30. **No Request ID / Trace ID Generation**
Hard to correlate logs across services.

### 31. **Missing Environment-Specific Configs**
Same config for dev/staging/prod.

---

## 📋 RECOMMENDATION PRIORITY MATRIX

| Priority | Issue | Effort | Impact | Action |
|----------|-------|--------|--------|--------|
| 🔴 CRITICAL | Hardcoded encryption key | Low | CRITICAL | Fix immediately |
| 🔴 CRITICAL | Default admin credentials | Low | CRITICAL | Fix immediately |
| 🔴 CRITICAL | TERYT credential validation | Low | High | Add to init |
| 🟠 HIGH | Error handling inconsistency | Medium | High | Refactor errors |
| 🟠 HIGH | Integer conversion safety | Low | Medium | Create utility |
| 🟠 HIGH | Mikrotik timeout/retry | Medium | High | Add timeouts |
| 🟠 HIGH | DASAN SSH injection risk | Medium | High | Validate MAC/escape |
| 🟠 HIGH | Secret key default | Low | High | Require env var |
| 🟡 MEDIUM | PII in logs | Medium | Medium | Add redaction |
| 🟡 MEDIUM | Domain validation | Low | Medium | Add schema validation |
| 🟡 MEDIUM | CSRF protection | Medium | Medium | Add token validation |
| 🟡 MEDIUM | Rate limiting | Low | Medium | Add slowapi |

---

## 🛠️ Implementation Roadmap

### Phase 1 (Week 1): Security Hotfixes
- [ ] Remove hardcoded encryption key
- [ ] Force admin password change requirement
- [ ] Validate TERYT credentials at startup
- [ ] Remove SECRET_KEY default

### Phase 2 (Week 2): Error Handling
- [ ] Standardize exception handling across routers
- [ ] Add proper error responses (400/409/500)
- [ ] Implement error tracking (Sentry)

### Phase 3 (Week 3): Input Validation
- [ ] Add domain validation
- [ ] Fix integer parsing
- [ ] Escape shell commands (DASAN service)
- [ ] Add CSRF tokens

### Phase 4 (Week 4): Operational Excellence
- [ ] Implement pagination
- [ ] Add query caching
- [ ] Set up centralized logging
- [ ] Add rate limiting

---

## 📚 Testing Recommendations

```bash
# Security testing
pip install bandit safety
bandit -r app/
safety check requirements.txt

# Type checking
pip install mypy
mypy app/ --strict

# Code quality
pip install pylint black isort
pylint app/
black --check app/
isort --check app/

# Performance testing
pip install locust
# Create load test for TERYT API
```

---

## 📞 Questions for Requirements Clarification

1. **Production vs. Development**: Should different configs apply?
2. **Compliance**: Any specific regulations (GDPR, PCI)?
3. **Audit Requirements**: How long to retain audit logs?
4. **Backup Strategy**: Recovery time objective (RTO)?
5. **Encryption**: Field-level or database-level?
6. **Monitoring**: What metrics matter most?

---

**Report Generated**: 2026-04-28  
**Reviewed By**: Code Analysis Agent  
**Status**: Review Complete - Awaiting Action Items
