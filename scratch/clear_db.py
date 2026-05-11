from app.database import SessionLocal
from sqlalchemy import text

def clear_data():
    db = SessionLocal()
    try:
        print("Disabling foreign keys temporarily...")
        db.execute(text("PRAGMA foreign_keys = OFF"))
        
        tables_to_clear = [
            "customer_devices",
            "customers",
            "subscriptions",
            "invoices",
            "ledger_entries",
            "cash_receipts",
            "customer_notices",
            "customer_device_sessions",
            "customer_device_notices",
            "support_tickets"
        ]
        
        for table in tables_to_clear:
            try:
                print(f"Clearing {table}...")
                db.execute(text(f"DELETE FROM {table}"))
            except Exception as e:
                print(f"  Note: Could not clear {table} (might not exist): {e}")
        
        db.commit()
        print("Data clear operation completed.")
        
        print("Re-enabling foreign keys...")
        db.execute(text("PRAGMA foreign_keys = ON"))
        
    except Exception as e:
        print(f"Global error clearing data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_data()
