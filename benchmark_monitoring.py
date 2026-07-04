import time
import os
import sys
from datetime import datetime, timedelta, timezone
from sqlalchemy import create_engine, select, func
from sqlalchemy.orm import sessionmaker

# Mock app setup
sys.path.append(os.getcwd())
from app import models
from app.database import Base

# Setup temporary DB
DB_URL = "sqlite:///benchmark.db"
engine = create_engine(DB_URL)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

# Seed data
print("Seeding data...")
now = datetime.now(timezone.utc)
num_flows = 50000
flows = []
for i in range(num_flows):
    ts = now - timedelta(minutes=i % (24*60))
    flows.append(models.NetFlowAggregate(
        src_ip=f"192.168.1.{i % 254}",
        dst_ip="8.8.8.8",
        src_port=1234,
        dst_port=80,
        protocol=6,
        bytes=1500,
        packets=1,
        timestamp=ts
    ))
    if len(flows) >= 1000:
        db.add_all(flows)
        flows = []
if flows:
    db.add_all(flows)
db.commit()
print(f"Seeded {num_flows} flows.")

def old_way():
    since = datetime.now(timezone.utc) - timedelta(hours=24)
    # This simulates get_global_stats in monitoring.py
    flows = db.scalars(
        select(models.NetFlowAggregate)
        .where(models.NetFlowAggregate.timestamp >= since)
        .order_by(models.NetFlowAggregate.timestamp.asc())
    ).all()

    buckets = {}
    for f in flows:
        hour_str = f.timestamp.strftime("%Y-%m-%d %H:00")
        if hour_str not in buckets:
            buckets[hour_str] = {"total_bytes": 0}
        buckets[hour_str]["total_bytes"] += f.bytes
    return len(buckets)

def new_way():
    since = datetime.now(timezone.utc) - timedelta(hours=24)
    # Dialect specific for SQLite
    time_label = func.strftime('%Y-%m-%d %H:00', models.NetFlowAggregate.timestamp)
    stmt = (
        select(time_label.label("hour"), func.sum(models.NetFlowAggregate.bytes).label("total_bytes"))
        .where(models.NetFlowAggregate.timestamp >= since)
        .group_by("hour")
    )
    results = db.execute(stmt).all()
    buckets = {r[0]: {"total_bytes": r[1]} for r in results}
    return len(buckets)

# Warm up
old_way()
new_way()

start = time.time()
for _ in range(5):
    old_way()
avg_old = (time.time() - start) / 5
print(f"Old way (in-memory) avg time: {avg_old:.4f}s")

start = time.time()
for _ in range(5):
    new_way()
avg_new = (time.time() - start) / 5
print(f"New way (DB-side) avg time: {avg_new:.4f}s")

improvement = (avg_old - avg_new) / avg_old * 100
print(f"Improvement: {improvement:.2f}%")

db.close()
os.remove("benchmark.db")
