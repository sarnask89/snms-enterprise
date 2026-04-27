# Agent Instructions: Hardware Background Tasks

The hardware integration for Mikrotik and DASAN is **feature-complete** in terms of UI and Services. The next step is to ensure the system can run automated background checks.

## 1. Environment & Security
- **Encryption**: Ensure `CRM_ENCRYPTION_KEY` is set in `.env`.
- **Credentials**: When testing, use a `NetDevice` with `driver_type="mikrotik_v7"` and valid credentials.

## 2. Background Sync Script
To run a background sync that automatically matches new leases without a human clicking "Import":
```python
# app/scripts/sync_loop.py (Concept for implementation)
import asyncio
from app.database import SessionLocal
from app.services.mikrotik_discovery import get_discoverable_leases
from app import models

async def run_sync():
    while True:
        db = SessionLocal()
        routers = db.scalars(select(models.NetDevice).where(models.NetDevice.driver_type == "mikrotik_v7")).all()
        for r in routers:
            discovered = await get_discoverable_leases(db, r)
            # Log auto-matchable items or trigger notifications
        db.close()
        await asyncio.sleep(300) # Sync every 5 minutes
```

## 3. Verification Commands
Run these to verify the integration:
1. **Lint & Type Check**: `mypy app/services/mikrotik.py` (Verify httpx usage).
2. **Regex Test**: Create a small script to verify `parse_mikrotik_comment("1825 Krupka M/33 Mic25")` returns the correct dictionary.
3. **Server Start**: `uvicorn app.main:app --reload` and navigate to `/admin/discovery`.

## 4. UI Audit
- Check if the "Odkrywanie Mikrotik" appears in the sidebar under **Infrastruktura**.
- Check if the "Sieć i Diagnostyka" card appears in the **Abonent Edit** page.

## 5. Security Warning
- **DO NOT** log decrypted passwords. 
- Ensure `mgmt_password_encrypted` is always handled via `security_utils.decrypt_password` only at the last moment of API/SSH connection.
