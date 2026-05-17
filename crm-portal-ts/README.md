# CRM Portal TS/Nuxt

Docelowy runtime `snms-enterprise` na bazie `Express + TypeORM + Nuxt`.

## Aktualny stan

- Backend API działa pod `/api/v1/...`
- Frontend Nuxt buduje się produkcyjnie
- Moduły parity są aktywne i raportowane przez `/api/v1/module-status`
- Runtime egzekwuje sesję i RBAC dla aktywnych routerów biznesowych
- Produkcyjny start fail-fast blokuje placeholderowe sekrety
- Kanoniczny gate wydania: `npm run verify:release`
- CI gate: `npm run verify:ci`

Szczegółowy status migracji: [MIGRATION_STATUS.md](./MIGRATION_STATUS.md)

## Wymagania

- Node.js 20+
- npm 10+

## Konfiguracja

1. Skopiuj `.env.example` do `.env`
2. Ustaw co najmniej:
   - `CRM_PORTAL_TS_SESSION_SECRET`
   - `CRM_ENCRYPTION_KEY`
   - `CRM_ADMIN_PASSWORD`
3. Dla TERYT uzupełnij opcjonalnie:
   - `TERYT_WS_USER`
   - `TERYT_WS_PASSWORD`

Najważniejsze zmienne:

- `CRM_PORTAL_TS_DB_PATH`: ścieżka SQLite dla runtime TS
- `CRM_PORTAL_TS_UPLOAD_ROOT`: katalog uploadów
- `CRM_PORTAL_TS_BACKUP_ROOT`: katalog backupów
- `CRM_PORTAL_TS_SESSION_SECRET`: podpis sesji auth
- `PORT`: port backendu

W `production` runtime wymaga prawdziwych wartości dla:

- `CRM_PORTAL_TS_SESSION_SECRET`
- `CRM_ENCRYPTION_KEY`
- `CRM_ADMIN_PASSWORD`

## Migracje Schematów

Jawny bootstrap schematu runtime:

```powershell
npm run migrate
npm run migrate:status
```

Zasady:

- runtime używa tabeli `runtime_schema_migrations`
- pusty zarządzany SQLite dostaje baseline migration automatycznie przy starcie
- jeśli baza ma istniejące tabele bez wpisu baseline, start kończy się błędem zamiast zgadywać stan schematu
- `/health/ready` wymaga również braku pending migration

## Start lokalny

Backend:

```powershell
npm install
npm run dev
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Domyślnie frontend proxuje `/api` do `http://localhost:8080/api`.

## Release Gate

Pełna weryfikacja przed wydaniem:

```powershell
npm run verify:release
```

To uruchamia:

- `npm run test`
- `npm run deployment:test`
- `npm run frontend:test`
- `npm run frontend:build`

CI uruchamia rozszerzony gate:

```powershell
npm run verify:ci
```

To dodaje:

- `npm run container:smoke`

## Checklist Release Readiness

- `npm run verify:release` przechodzi bez błędów
- `GET /api/v1/module-status` pokazuje aktywne moduły jako `works_in_ts`
- `.env` ma ustawione sekrety i ścieżki runtime
- `npm run migrate:status` nie pokazuje pending migration
- katalogi DB, uploadów i backupów są dostępne do zapisu
- smoke auth działa: login, `me`, zmiana hasła, logout
- smoke RBAC działa: brak sesji daje `401`, konto `view` nie przechodzi przez write/admin
- frontendowy test access policy działa dla tras public/protected i filtrowania nawigacji
- smoke operacyjny działa: klient, sieć, finanse, helpdesk, dokumenty, TERYT, backup
- health endpointy działają: `/health`, `/health/live`, `/health/ready`
- compose ma healthchecki dla backendu, frontendu i reverse proxy
- workflow GitHub Actions uruchamia `verify:ci` z korzenia repo
- artefakty deploymentowe istnieją: `Dockerfile`, `frontend/Dockerfile`, `docker-compose.production.yml`, `ops/nginx/default.conf`

## Deployment Produkcyjny

Najprostsza ścieżka wdrożenia jest oparta o `docker compose`:

```powershell
docker compose -f docker-compose.production.yml build
docker compose -f docker-compose.production.yml up -d
```

Topologia:

- `backend`: Express/TypeORM na porcie `8080`
- `frontend`: Nuxt SSR na porcie `3000`
- `reverse-proxy`: Nginx na porcie `80`, proxy ` /api -> backend `, ` /health* -> backend ` i ` / -> frontend `

Uwagi operacyjne:

- Compose czyta sekrety z lokalnego `.env`
- Możesz podmienić plik env przez `CRM_PORTAL_TS_ENV_FILE`
- backend uruchamia runtime migration runner przed przyjęciem ruchu
- trwałe dane backendu są trzymane w wolumenie `backend-runtime`
- backupy i uploady są utrzymywane pod `/app/runtime/...` wewnątrz kontenera backendu
- mapowanie `127.0.0.1:8080:8080` zostaje celowo włączone do diagnostyki i bezpośrednich smoke testów API
- hostowe porty można nadpisać przez `CRM_PORTAL_TS_BACKEND_HOST_PORT` i `CRM_PORTAL_TS_PROXY_PORT`
- backend i proxy mają jawne readiness/liveness healthchecki pod wdrożenie
- w `production` cookie sesyjne jest oznaczane jako `Secure`

## Container Smoke

Kontenerowy smoke używany w CI:

```powershell
npm run container:smoke
```

Skrypt:

- generuje tymczasowy plik env dla `production`
- buduje i uruchamia `docker compose`
- czeka na `/health/live`, `/health/ready` i `/api/v1/module-status`
- sprząta kontenery oraz wolumen po zakończeniu

Workflow CI znajduje się w [crm-portal-ts-release-gate.yml](C:\Users\xxx\crm-portal\.github\workflows\crm-portal-ts-release-gate.yml).

## Produkcja

- Użyj własnych sekretów zamiast wartości z przykładu
- Nie commituj `.env`
- Traktuj `.env.example` jako jedyny bezpieczny wzorzec konfiguracji
- Jeśli frontend ma działać osobno, ustaw właściwy target proxy albo publiczny adres API
