# Tech Stack: ISP CRM Portal

## Backend
- **Framework**: FastAPI (Python 3.14+)
- **ORM**: SQLAlchemy 2.0+
- **Database**: SQLite (Production/Dev), PostgreSQL (Optional)
- **Migrations**: Alembic
- **Async I/O**: httpx, motor (if needed)

## Frontend
- **Templating**: Jinja2
- **Interactivity**: HTMX (Ajax/Websockets)
- **Styling**: Tailwind CSS (Utility-first)
- **Icons**: FontAwesome
- **Maps**: Leaflet (OpenStreetMap)

## Infrastructure Integrations
- **Network API**: RouterOS (Mikrotik API)
- **Regulatory**: GUGiK (ULDK API), TERYT (GUS Web Services)
- **Files**: local filesystem with path tracking in DB
- **Backups**: Physical SQLite database cloning with timestamped versioning.

## Development & Testing
- **Testing**: pytest (Unit/Integration), Playwright (E2E)
- **Mocking**: Custom Mikrotik and TERYT service mocks
- **Documentation**: Conductor (Spec-driven development)
- **Versioning**: Custom Python scripts (`bump_version.py`, `push.py`) for SemVer automation and Git tagging.
