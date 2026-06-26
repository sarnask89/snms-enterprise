from app.database import SessionLocal
from app import models
from sqlalchemy import func, select

db = SessionLocal()
count = db.scalar(select(func.count()).select_from(models.NetFlowAggregate))
print(f"Total NetFlowAggregate rows: {count}")
db.close()
