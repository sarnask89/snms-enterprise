from app.database import SessionLocal
from app import models
from sqlalchemy import delete

def clear_data():
    db = SessionLocal()
    try:
        # Order matters for foreign keys
        print("Clearing CustomerDevice sessions, notices, subscriptions...")
        db.execute(delete(models.CustomerDeviceSession))
        db.execute(delete(models.CustomerDeviceNotice))
        db.execute(delete(models.Subscription))
        
        print("Clearing CustomerDevices...")
        db.execute(delete(models.CustomerDevice))
        
        print("Clearing Customers...")
        db.execute(delete(models.Customer))
        
        db.commit()
        print("Database cleared successfully (Customers and Devices).")
    except Exception as e:
        db.rollback()
        print(f"Error clearing database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    clear_data()
