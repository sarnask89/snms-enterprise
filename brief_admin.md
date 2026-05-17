 ```python
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import shutil
from pathlib import Path

app = FastAPI()

# Assume these models are defined in your database schema
class AuditLog(models.Model):
    id = models.Integer(primary_key=True)
    timestamp = models.DateTime(timezone=timezone.utc)
    actor_id = models.ForeignKey(PortalUser, ondelete=models.CASCADE)
    action = models.StringField()
    details = models.TextField()

class ConfigReloadLog(models.Model):
    id = models.Integer(primary_key=True)
    created_at = models.DateTime(timezone=timezone.utc)
    actor_id = models.ForeignKey(PortalUser, ondelete=models.CASCADE)
    note = models.TextField(null=True)

class AppSetting(models.Model):
    id = models.Integer(primary_key=True)
    key = models.StringField()
    value = models.TextField()

class PortalUser(models.Model):
    id = models.Integer(primary_key=True)
    username = models.CharField(max_length=100)
    # Other fields...

# Assume these functions are defined in your database operations
def record_audit(db, action, resource_type, resource_id, details):
    db.add(AuditLog(action=action, resource_type=resource_type, resource_id=resource_id, details=details))
    db.commit()

def teryt_import.import_terc_xml(db, file):
    # Implementation of importing TERC XML
    pass

def teryt_import.import_simc_xml(db, file):
    # Implementation of importing SIMC XML
    pass

def teryt_import.import_ulic_xml(db, file):
    # Implementation of importing ULIC XML
    pass

# Assume these functions are defined in your database operations
def teryt_import(import_function, db, file):
    try:
        result = import_function(db, file)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error importing XML: {str(e)}")

# Assume these functions are defined in your database operations
def teryt_import_create_backup(filename):
    # Implementation of creating a backup
    pass

# Assume these functions are defined in your database operations
def teryt_import_delete_backup(filename):
    # Implementation of deleting a backup
    pass

# Assume these functions are defined in your database operations
def teryt_import_download_backup(filename):
    # Implementation of downloading a backup
    pass

# Assume these functions are defined in your database operations
def teryt_import_upload_backup(file):
    # Implementation of uploading a backup
    pass

# Assume these functions are defined in your database operations
def teryt_import_list_backups():
    # Implementation of listing backups
    pass

# Assume these functions are defined in your database operations
def teryt_import_reload_config(db, note=None):
    # Implementation of reloading configuration
    pass

# Assume these functions are defined in your database operations
def teryt_import_update_copyright_text(db, value):
    # Implementation of updating copyright text
    pass

# Assume these functions are defined in your database operations
def portal_user_delete(user_id, db):
    # Implementation of deleting a user
    pass

# Define the routes for the admin panel
@app.get("/admin")
async def admin_panel(request: Request):
    return "Welcome to the Admin Panel!"

@app.post("/admin/users/{user_id}/delete", dependencies=[Depends(require_admin)])
async def portal_user_delete(user_id: int, request: Request, db: Session = Depends(get_db)):
    u = db.get(PortalUser, user_id)
    if u and u.id != request.state.portal_user.id:
        record_audit(db, "delete", resource_type="portal_user", resource_id=u.id, details=f"user: {u.username}", request=request)
        db.delete(u)
        db.commit()
    return RedirectResponse("/admin/users", status_code=303)

@app.get("/admin/users")
async def admin_users(request: Request, db: Session = Depends(get_db)):
    users = db.scalars(select(PortalUser)).all()
    return {"users": [user.username for user in users]}

@app.post("/admin/audit-logs", dependencies=[Depends(require_admin)])
async def admin_audit_logs(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100)).all())
    users = {u.id: u for u in db.scalars(select(PortalUser)).all()}
    return {"rows": rows, "users": users}

@app.post("/admin/backups", dependencies=[Depends(require_admin)])
async def admin_backups(request: Request, db: Session = Depends(get_db)):
    backups = list(db.scalars(select(ConfigReloadLog).order_by(ConfigReloadLog.created_at.desc()).limit(100