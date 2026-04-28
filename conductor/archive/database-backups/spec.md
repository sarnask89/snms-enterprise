# Specification: Database Backup System

## Overview
The system must allow administrators to create a physical copy of the `crm.sqlite` database, download it via the browser, and manage stored backups to save disk space.

## Requirements

### 1. Backup Creation
- Triggered by POST request to `/admin/backups/create`.
- Uses `shutil.copy2` to copy `crm.sqlite` to a dedicated `backups/` directory.
- Filename format: `backup_YYYYMMDD_HHMMSS.sqlite`.
- Record the event in Audit Logs.

### 2. Backup Listing
- The `/admin/backups` page must list all `.sqlite` files in the `backups/` directory.
- Display filename, creation date, and size in KB.

### 3. Backup Download
- Endpoint `/admin/backups/download/{filename}`.
- Stream the file as an attachment.
- Verify user has Admin role.

### 4. Backup Deletion
- Endpoint `/admin/backups/delete/{filename}`.
- Remove the file from the filesystem.
- Verify user has Admin role.

## Security
- Only users with `ADMIN` role can create/delete/download backups.
- Path traversal protection: Ensure `filename` parameter doesn't allow access outside `backups/` directory.
