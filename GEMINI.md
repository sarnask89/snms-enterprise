# ISP CRM Portal - Project Guidelines

## Project Structure
- **Root Directory**: `crm-portal/`
- **Application Sources**: `crm-portal/app/`
- **Only proper directory for app sources and database files is `crm-portal`.** Always ensure commands are executed within this directory.

## Database Management

The project uses SQLite as the primary database.

- **Main Database File**: `crm-portal/crm.sqlite`
- **Database URL**: `sqlite:///crm.sqlite` (relative to `crm-portal` root)

### Database Maintenance
When modifying the database schema or performing maintenance, always use the `crm-portal` directory as the working directory.

#### Schema Updates
If you add columns or change models in `app/models.py`, ensure the physical database is updated. Since Alembic is present but may not be automatically triggered, use manual SQL if necessary:

```powershell
python -c "import sqlite3; conn = sqlite3.connect('crm.sqlite'); conn.execute('ALTER TABLE ...'); conn.commit(); conn.close()"
```

#### Verification Scripts
Always verify database state using scripts that import from `app.database`:

```powershell
python -c "from app.database import SessionLocal; from app import models; db = SessionLocal(); ... result = db.get(...); print(result)"
```

## Numbering Plans

The system uses numbering plans to generate customer IDs and document numbers.

- **Default Plan**: Only one plan of a specific `doc_type` (e.g., `customer`) can be the default.
- **Logic**:
  - `is_default` field in `NumberPlan` model.
  - Reset logic in `app/routers/config_snms.py` ensures exclusivity.
  - `app/routers/customers.py` handles auto-selection of the default plan in forms.

## Engineering Standards

- **File Management**: ALWAYS use the `windows-file-management` skill and `windows-mcp` tools for browsing, searching, copying, deleting, and renaming files. DO NOT use standard console-based file searches or manipulation commands when these specialized tools are available.
- **HTMX Fragments**: Always return clean HTML fragments for HTMX requests.
- **Form Validation**: Use `_opt_int` for optional integer fields to prevent validation errors with empty strings.
- **Security**: Sensitive fields in forms MUST use `autocomplete="new-password"` to prevent browser auto-fill corruption.
- **UI Consistency**: Use standard Tailwind CSS classes and the provided Jinja2 macros in `templates/components/`.

## Automated Versioning
- **Git Push**: ALWAYS use `python scripts/push.py` instead of raw `git push` to ensure every push is versioned and tagged.
    - Default: `python scripts/push.py` (patch increment)
    - Minor: `python scripts/push.py minor`
    - Major: `python scripts/push.py major`
