# CRM Portal (FastAPI, bez Strapi)

**Decyzje architektoniczne (D1–D6):** [`../docs/CRM_FASTAPI_DECISIONS.md`](../docs/CRM_FASTAPI_DECISIONS.md) · **Handoff agent 2 (SNMS):** [`../CRM_FASTAPI_LMS_PARITY_AGENT2_HANDOFF.md`](../CRM_FASTAPI_LMS_PARITY_AGENT2_HANDOFF.md) · **Status MVP:** [`MVP_TRACKING.md`](MVP_TRACKING.md)

## Decyzja stacku

- **SSR**: FastAPI + **Jinja2** + **HTMX** (bez osobnego SPA).
- **Dane**: **SQLAlchemy 2**; domyślnie **SQLite** (`crm.sqlite`), zmienna `DATABASE_URL` dla PostgreSQL.

## Uruchomienie

```bash
cd crm-portal
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8080
```

Otwórz http://127.0.0.1:8080 — logowanie: `admin` / `test` (zmień przez `CRM_ADMIN_PASSWORD`).

### PostgreSQL (opcjonalnie)

1. Zainstaluj sterownik, np. `pip install "psycopg[binary]>=3.2.0"` (lub `psycopg2-binary`).
2. W `.env`: `DATABASE_URL=postgresql+psycopg://USER:HASŁO@localhost:5432/NAZWA_BAZY`
3. Uruchom aplikację — `init_db` / migracje w `app/init_db.py` mają działać na Postgresie tam, gdzie nie polegają na dialekcie SQLite.

## Zakres MVP

Klienci, taryfy i faktury, helpdesk (zgłoszenia), dokumenty, uproszczony łańcuch TERYT (słowniki w bazie). **Net Devices**: tylko strona informacyjna (NMS poza zakresem).

## Integracja GUS — TERYT ws1

- Portal: [API TERYT](https://api.stat.gov.pl/Home/TerytApi) (rejestracja konta u GUS).
- W projekcie: `zeep` + WS-Security `UsernameToken`, WSDL domyślnie `https://uslugaterytws1.stat.gov.pl/wsdl/terytws1.wsdl`.
- Ustaw w pliku **`.env`** (skopiuj z `.env.example`): `TERYT_WS_USER`, `TERYT_WS_PASSWORD`.
- **Nigdy nie commituj `.env` ani haseł.** Jeśli hasło trafiło do czatu lub do repo — **zmień je w GUS** i wygeneruj nowe.
- Po zalogowaniu do panelu CRM: [GET `/teryt/ws/check`](/teryt/ws/check) — pole `czy_zalogowany`; [GET `/teryt/ws/wojewodztwa`](/teryt/ws/wojewodztwa) — próbka listy z usługi.
