
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app import models
from app.config import DATABASE_URL
from datetime import date

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

# Add customer
c = models.Customer(first_name="Bolt", last_name="Tester", customer_code="BOLT-001")
db.add(c)
db.flush()

# Add tariff
t = models.Tariff(name="Gigabit Fiber", monthly_price=100.00, active=True)
db.add(t)
db.flush()

# Add device
d = models.CustomerDevice(customer_id=c.id, hostname="bolt-ont", ip_address="10.0.0.5")
db.add(d)
db.flush()

# Add subscription
s = models.Subscription(
    customer_id=c.id,
    tariff_id=t.id,
    device_id=d.id,
    start_date=date(2026, 1, 1),
    active=True,
    technology="FTTH"
)
db.add(s)
db.commit()
db.close()
