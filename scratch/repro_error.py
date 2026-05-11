from app.database import SessionLocal
from app import models
from sqlalchemy import select

db = SessionLocal()
try:
    mac = "00:50:8D:74:53:A9"
    print(f"Checking table name for CustomerDevice: {models.CustomerDevice.__tablename__}")
    q = select(models.CustomerDevice).where(models.CustomerDevice.mac_address == mac)
    print(f"Generated SQL: {q}")
    res = db.scalar(q)
    print("Success!")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
