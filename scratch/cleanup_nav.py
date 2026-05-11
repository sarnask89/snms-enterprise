from app.database import SessionLocal
from app import models
from app.nav_access import NAV_DEFINITION

def cleanup():
    db = SessionLocal()
    try:
        current_keys = {n[0] for n in NAV_DEFINITION}
        items = db.query(models.NavMenuItem).all()
        deleted = 0
        for item in items:
            if item.key not in current_keys:
                # Delete associated permissions first
                db.query(models.RoleMenuPermission).filter_by(nav_item_id=item.id).delete()
                db.delete(item)
                deleted += 1
        db.commit()
        print(f"Deleted {deleted} orphaned menu items.")
    finally:
        db.close()

if __name__ == "__main__":
    cleanup()
