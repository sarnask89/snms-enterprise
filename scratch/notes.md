# CRM Stability Scratchpad

## Current Status
- [x] Refactored `CustomerDevice` model mapping (from legacy `nodes` table).
- [x] Verified database schema (table `customer_devices` exists).
- [x] Updated background sync service to use correct models.
- [x] Fixed "no such table: nodes" error in Mikrotik synchronization.
- [x] Updated project guidelines (`GEMINI.md`) to use `crm` daemon and `.venv`.
- [x] Cleaned up stale Python processes.
- [x] Optimized resource usage (reduced logging, increased sync interval, optional reload).

## Issues to Monitor
- [ ] Verify if `/customer-devices` page loads consistently in the browser.
- [ ] Check `crm-server-error.log` for any new occurrences of `nodes` references.
- [ ] Ensure `AUTH_ENABLED=False` is reverted to `True` before final delivery (if requested).

## Next Steps
1. Start the server using `crm start`.
2. Perform a final browser check of the primary modules.
3. Remove debug logs and scratch scripts.
