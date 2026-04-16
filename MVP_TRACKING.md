# MVP i moduły — śledzenie (CRM Portal)

Odniesienie: sekcja 5 w `../CRM_FASTAPI_LMS_PARITY_AGENT2_HANDOFF.md`.

Legenda: `[x]` zaimplementowane (rdzeń), `[~]` częściowo / placeholder, `[ ]` backlog.

## Infrastruktura
- [x] FastAPI, Jinja2, static, HTMX
- [x] Logowanie personelu (`portal_users`, sesje)
- [x] RBAC: role + menu konfigurowalne + ścieżki
- [ ] Alembic / pełne migracje
- [~] Testy automatyczne (smoke: `/login`; rozszerzyć o ścieżki CRM)

## Administracja / system
- [x] Pulpit + info (`/admin/info`)
- [x] Użytkownicy portalu (`/admin/users`)
- [x] Menu: widoczność ról, etykiety URL
- [x] Kopie zapasowe — rejestr eksportów (`/admin/backups`; backup pliku DB poza MVP)
- [ ] Audyt (D6)

## Klienci
- [x] Lista, wyszukiwarka, CRUD
- [x] Grupy klientów + członkowie
- [ ] Powiadomienia / notices (SNMS)
- [ ] Raporty / druk

## Węzły (CRM)
- [x] CRUD węzłów, przypisanie do klienta
- [x] Grupy węzłów, sesje i powiadomienia węzłów

## Finanse
- [x] Taryfy (CRUD uproszczony)
- [x] Faktury (CRUD uproszczony)
- [x] Subskrypcje / przypisanie taryfy do klienta
- [ ] Płatności stałe, kasa, import wpłat — backlog

## Dokumenty
- [x] Lista + metadane + CRUD + upload pliku (skan), pobieranie, usuwanie z dysku
- [ ] Generator masowy — backlog

## Helpdesk
- [x] Lista, nowe zgłoszenie, status
- [x] Przypisanie do użytkownika roli `service`
- [x] Kolejki, kategorie, wyszukiwarka; [x] raporty zagregowane (`/helpdesk/reports`)

## TERYT / adres
- [x] Słowniki lokalne w DB + formularz kaskadowy
- [x] Integracja ws1 (diagnostyka + przykładowe API)

## Sieci IP / urządzenia
- [x] CRUD pul IP (`IpNetwork`) — **inwentaryzacja**, nie NMS
- [x] CRUD urządzeń (`NetDevice`) — **inwentaryzacja**, nie NMS
- [ ] Wykorzystanie pul, automatyczny provisioning — poza zakresem (NMS)

## Wyłączone / zgodnie z handoffem
- [ ] **Net Devices (NMS)** — synchronizacja, mapy, CLI — nie teraz
- [x] VoIP, hosting, wiadomości, terminarz, statystyki (CRUD w SNMS); pełny billing VoIP — backlog

## Materiały
- `../docs/CRM_FASTAPI_DECISIONS.md` — D1–D6
- `../CRM_FASTAPI_LMS_PARITY_AGENT2_HANDOFF.md` — pełny kontekst
