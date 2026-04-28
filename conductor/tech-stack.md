# Technology Stack - CRM Portal

## Core Backend
- **Language:** Python 3.x
- **Framework:** FastAPI (High performance, modern web framework)
- **ORM:** SQLAlchemy 2.0 (Next-generation SQL toolkit)
- **Migrations:** Alembic (Lightweight database migration tool)
- **Validation:** Pydantic (Data validation and settings management)

## Frontend & SSR
- **Templating:** Jinja2 (Modern and designer-friendly templating language)
- **Interactions:** HTMX (Access to AJAX, CSS Transitions, WebSockets and Server Sent Events directly in HTML)
- **Styling:** Tailwind CSS (A utility-first CSS framework for rapid UI development)

## Data Storage
- **Database (Development/Default):** SQLite (File-based database for simplicity)
- **Database (Production Option):** PostgreSQL (Robust, open-source relational database)

## External Integrations & Utilities
- **SOAP Client:** Zeep (For integration with the GUS TERYT API)
- **Geocoding:** GUGiK Geoportal (UUG/PUWG 1992) for authoritative Polish address-to-GPS conversion.
- **Testing:** Pytest (A mature full-featured Python testing tool)
- **E2E Testing:** Playwright (Automated browser testing for critical flows)
- **HTTP Client:** HTTPX (Next-generation HTTP client for Python)
- **Environment Management:** python-dotenv (For managing configuration via `.env` files)
