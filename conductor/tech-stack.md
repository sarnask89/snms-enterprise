# Technology Stack

## Core Technologies
- **Language:** Python 3.10+
- **Backend Framework:** FastAPI
- **Database:** SQLite (Default: `crm.sqlite`) with PostgreSQL compatibility via SQLAlchemy ORM.
- **Migrations:** Alembic

## Frontend
- **Templating:** Jinja2
- **Interactivity:** HTMX
- **Styling:** Tailwind CSS (via PostCSS/Tailwind CLI)
- **Charts:** ApexCharts
- **Icons:** FontAwesome & Lucide

## Integrations & Services
- **Device Management:** Paramiko (SSH for Dasan OLTs), RouterOS-API (MikroTik)
- **Security:** Passlib (Bcrypt), Cryptography (Fernet for encrypted credentials)
- **Testing:** Pytest

## Development & Automation
- **Environment:** Virtualenv (`.venv`)
- **Server:** Uvicorn