# Implementation Plan: Database Backup System

## Step 1: Directory Setup
- [x] Create `backups/` directory in project root.
- [x] Add `.gitignore` to `backups/` to prevent committing actual database files.

## Step 2: Router Implementation (`app/routers/admin.py`)
- [x] Update `admin_backups` to scan `backups/` directory and return a list of dictionaries to the template.
- [x] Implement `admin_backups_create` (POST `/admin/backups/create`).
- [x] Implement `admin_backups_download` (GET `/admin/backups/download/{filename}`).
- [x] Implement `admin_backups_delete` (POST `/admin/backups/delete/{filename}`).

## Step 3: Template Refinement
- [x] Ensure `templates/admin/backups.html` correctly displays the list and links.
- [x] Add feedback messages (HTMX toast or flash messages).

## Step 4: Verification
- [x] Manual test: Create backup -> Verify file exists -> Download -> Delete.
- [x] Automated test in `tests/test_admin_backups.py`.
