import time
import os
from sqlalchemy import event, select
from sqlalchemy.orm import Session
from fastapi import Request
from starlette.datastructures import Headers, URL, QueryParams

# Set environment variables for settings validation
os.environ["CRM_SECRET_KEY"] = "benchmark_secret_key_32_chars_long_!!!"
os.environ["CRM_ENCRYPTION_KEY"] = "YmVuY2htYXJrX2VuY3J5cHRpb25fa2V5XzMyX2NoYXJzIQ==" # Base64 of 32 chars
os.environ["CRM_ADMIN_PASSWORD"] = "admin"

from app import models
from app.database import db_manager, get_db
from app.routers.subscriptions import subscription_list
from app.init_db import init_all

# Mock Request State
class MockState:
    def __init__(self):
        self.portal_user = None
        self.can_write_crm = True

# Mock Request
class MockRequest:
    def __init__(self):
        self.headers = Headers()
        self.scope = {"type": "http"}
        self.state = MockState()
        self.cookies = {}
        self.url = URL("http://localhost/subscriptions")
        self.query_params = QueryParams()

def benchmark():
    # Ensure DB is initialized
    init_all()

    db = next(get_db())

    # Add more dummy data
    print("Seeding dummy data...")
    db.query(models.Subscription).delete()
    db.query(models.CustomerDevice).delete()
    db.query(models.Customer).delete()
    db.query(models.Tariff).delete()
    db.query(models.VatRate).delete()
    db.commit()

    vat = models.VatRate(label="23%", rate_percent=23)
    db.add(vat)
    db.flush()

    customers = []
    for i in range(50):
        c = models.Customer(first_name=f"First{i}", last_name=f"Last{i}", customer_code=f"C{i:03d}")
        db.add(c)
        customers.append(c)

    tariffs = []
    for i in range(10):
        t = models.Tariff(name=f"Tariff{i}", monthly_price=10.0 * (i+1), vat_rate_id=vat.id)
        db.add(t)
        tariffs.append(t)

    db.flush()

    devices = []
    for i in range(50):
        d = models.CustomerDevice(customer_id=customers[i].id, hostname=f"node{i}")
        db.add(d)
        devices.append(d)

    db.flush()

    for i in range(100):
        sub = models.Subscription(
            customer_id=customers[i % 50].id,
            tariff_id=tariffs[i % 10].id,
            device_id=devices[i % 50].id if i % 2 == 0 else None
        )
        db.add(sub)
    db.commit()
    db.close() # Close seeding session

    query_count = 0
    @event.listens_for(db_manager.engine, "after_cursor_execute")
    def after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
        nonlocal query_count
        if "PRAGMA" not in statement:
            query_count += 1

    db = next(get_db()) # New session for benchmark
    request = MockRequest()

    start_time = time.time()
    # Execute subscription_list
    subscription_list(request, db)
    end_time = time.time()

    print(f"Number of queries: {query_count}")
    print(f"Execution time: {end_time - start_time:.4f} seconds")

if __name__ == "__main__":
    benchmark()
