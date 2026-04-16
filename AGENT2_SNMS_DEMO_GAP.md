# Agent 2 — luki funkcjonalne `crm-portal` względem typowego panelu ISP (SNMS)

**Odniesienie:** moduły i menu utrzymywane w `app/nav_access.py` (`NAV_DEFINITION`, `NAV_GROUPS`).  
**Stan:** dokument roboczy; po każdej większej zmianie uruchom `python -c "from app.main import app"`.

## Mapowanie modułów

| Obszar (SNMS) | Ścieżki w portalu |
|----------------|-------------------|
| Administracja | `/admin/*` |
| Klienci | `/customers`, grupy, raporty |
| Węzły sieci (w LMS UI: „Komputery”, §3.4) | `/nodes`, grupy, sesje, powiadomienia |
| Sieci IP | `/ip-networks`, wykorzystanie |
| Helpdesk | `/helpdesk/*` |
| Finanse | `/finances/*`, `/subscriptions` |
| Konfiguracja | `/config/*` (oddziały, VAT, plany numeracji, klucze) |

## Checklist review

- [ ] Import aplikacji bez wyjątku
- [ ] Menu zgodne z `NAV_DEFINITION` dla ról
- [ ] Wpis w `AGENT_LOGS.md` (repozytorium nadrzędne)
