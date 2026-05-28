import time
import os
import sys

# Ensure app is in path
sys.path.append(os.getcwd())

from sqlalchemy import select, func
from sqlalchemy.orm import Session, joinedload
from app import models
from app.database import SessionLocal, engine

def setup_data(db: Session, count=100):
    # Check if we already have data
    if db.scalar(select(func.count()).select_from(models.Customer)) > 0:
        print("Data already exists, skipping setup.")
        return

    print(f"Generating {count} customers and devices...")
    for i in range(count):
        customer = models.Customer(
            customer_code=f"C{i:04d}",
            first_name=f"First{i}",
            last_name=f"Last{i}",
        )
        db.add(customer)
        db.flush()

        device = models.CustomerDevice(
            customer_id=customer.id,
            name=f"Device{i}",
            hostname=f"host{i}",
            status=models.CustomerDeviceStatus.active
        )
        db.add(device)
        db.flush()

        # Add a tariff and subscription
        tariff = models.Tariff(name=f"Tariff{i}", monthly_price=50.0)
        db.add(tariff)
        db.flush()

        sub = models.Subscription(
            customer_id=customer.id,
            tariff_id=tariff.id,
            device_id=device.id,
            active=True
        )
        db.add(sub)

    db.commit()
    print("Data generation complete.")

def benchmark_original(db: Session):
    start = time.time()

    # Original logic from node_list (simplified for benchmark)
    stmt = select(models.CustomerDevice).order_by(models.CustomerDevice.id)
    rows = list(db.scalars(stmt).all())

    # Redundant full table fetch of customers
    customers = {c.id: c for c in db.scalars(select(models.Customer)).all()}

    # Separate fetch for subscriptions
    node_ids = [n.id for n in rows]
    subs = {}
    if node_ids:
        active_subs = db.scalars(
            select(models.Subscription)
            .where(models.Subscription.device_id.in_(node_ids), models.Subscription.active == True)
        ).all()
        # This triggers lazy load for tariff if we were to access it in template
        # So we should include it in benchmark
        for s in active_subs:
            _ = s.tariff.name
        subs = {s.device_id: s for s in active_subs}

    # Simulate template access that triggers lazy loads if they were missing
    for n in rows:
        _ = n.customer.last_name if n.customer else None

    end = time.time()
    return end - start

def benchmark_optimized(db: Session):
    start = time.time()

    # Optimized logic using joinedload
    stmt = (
        select(models.CustomerDevice)
        .options(
            joinedload(models.CustomerDevice.customer),
            joinedload(models.CustomerDevice.subscriptions).joinedload(models.Subscription.tariff)
        )
        .order_by(models.CustomerDevice.id)
    )
    rows = list(db.scalars(stmt).unique().all())

    # subscriptions are already loaded, we can process them in memory
    subs = {}
    for n in rows:
        active_sub = next((s for s in n.subscriptions if s.active), None)
        if active_sub:
            subs[n.id] = active_sub

    # Simulate template access
    for n in rows:
        _ = n.customer.last_name if n.customer else None
        if n.id in subs:
            _ = subs[n.id].tariff.name

    end = time.time()
    return end - start

if __name__ == "__main__":
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        setup_data(db, 200)

        # Warmup
        benchmark_original(db)
        benchmark_optimized(db)

        n_runs = 5
        orig_times = [benchmark_original(db) for _ in range(n_runs)]
        opt_times = [benchmark_optimized(db) for _ in range(n_runs)]

        avg_orig = sum(orig_times) / n_runs
        avg_opt = sum(opt_times) / n_runs

        print(f"Original average time: {avg_orig:.4f}s")
        print(f"Optimized average time: {avg_opt:.4f}s")
        print(f"Improvement: {(avg_orig - avg_opt) / avg_orig * 100:.2f}%")

    finally:
        db.close()
