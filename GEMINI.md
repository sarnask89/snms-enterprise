# ISP CRM Portal - Project Guidelines

> [!IMPORTANT]
> **Global Automation Permissions**: The user has granted absolute permission for:
> 1. **Full-Stack Modifications**: Writing to any file, creating new modules, and updating database schemas.
> 2. **Browser Automation**: Executing complex JavaScript, capturing screenshots, and performing multi-step interaction tests.
> 3. **Autonomous Execution**: Running commands and scripts without individual approval to improve efficiency.
> 4. **AI-Driven Generation**: Using the built-in Module Engine to extend system capabilities.

## STRICT RULES
1. **Daemon Management**: ALWAYS use `crm start`, `crm stop`, `crm restart`, and `crm status` for server management. NEVER run `uvicorn` manually.
2. **PowerShell Only**: ALWAYS use PowerShell for shell commands. NEVER use bash/linux commands.

## Project Structure
- **Root Directory**: `crm-portal/`
- **Application Sources**: `crm-portal/app/`
- **Only proper directory for app sources and database files is `crm-portal`.** Always ensure commands are executed within this directory.

## Database Management

The project uses SQLite as the primary database.

- **Main Database File**: `crm-portal/crm.sqlite`
- **Database URL**: `sqlite:///crm.sqlite` (relative to `crm-portal` root)

### MCP Database Tools
The system is integrated with the `toolbox-sqlite` MCP server.
- **Tools**: Use `mcp_toolbox-sqlite_execute_sql` for advanced queries and `mcp_toolbox-sqlite_list_tables` for schema discovery.
- **Usage**: Prefer using these MCP tools for database inspection and maintenance over manual `python -c` scripts when possible.
- **Verification**: Always verify changes by listing tables or querying affected rows using the MCP tools.

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

## Server Management

The project uses a PowerShell-based daemon to manage the server lifecycle.

- **Commands**: 
    - `crm start`: Starts the server in the background.
    - `crm stop`: Stops the background server.
    - `crm restart`: Restarts the server.
    - `crm status`: Checks if the server is running.
- **Rule**: ALWAYS use these commands instead of running `uvicorn` or `python -m uvicorn` manually.

## Engineering Standards

- **Python Environment**: ALWAYS use the virtual environment located in `.venv`. In PowerShell, use `.venv\Scripts\python.exe` or ensured aliases. DO NOT use system-wide python.
- **File Management**: ALWAYS use the `windows-file-management` skill and `windows-mcp` tools for browsing, searching, copying, deleting, and renaming files. DO NOT use standard console-based file searches or manipulation commands when these specialized tools are available.
- **Dependency Management**: Models are managed centrally via `app/models/__init__.py`. When adding a new model file in `app/models/`, you MUST import and export its classes in `__init__.py` to ensure they are accessible via the `from app import models` pattern used throughout the routers.
- **HTMX Fragments**: Always return clean HTML fragments for HTMX requests.
- **Form Validation**: Use `_opt_int` for optional integer fields to prevent validation errors with empty strings.
- **Security**: Sensitive fields in forms MUST use `autocomplete="new-password"` to prevent browser auto-fill corruption.
- **UI Consistency**: Use standard Tailwind CSS classes and the provided Jinja2 macros in `templates/components/`.

## Automated Versioning
- **Git Push**: ALWAYS use `python scripts/push.py` instead of raw `git push` to ensure every push is versioned and tagged.
    - Default: `python scripts/push.py` (patch increment)
    - Minor: `python scripts/push.py minor`
- **JavaScript Policy**: You are explicitly allowed to use inline scripts, external libraries (Alpine.js, HTMX), and complex JavaScript logic to enhance the user experience. Do not hesitate to implement interactive features.
