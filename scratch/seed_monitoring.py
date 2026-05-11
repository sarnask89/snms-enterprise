import sqlite3
import random
from datetime import datetime, timedelta

conn = sqlite3.connect('crm.sqlite')

# Create tables if not exist (just in case)
conn.executescript("""
CREATE TABLE IF NOT EXISTS network_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100),
    link_type VARCHAR(50),
    capacity_mbps INTEGER,
    source_device_id INTEGER,
    target_device_id INTEGER,
    source_port VARCHAR(50),
    target_port VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS network_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id INTEGER,
    timestamp DATETIME,
    cpu_usage INTEGER,
    mem_usage INTEGER,
    in_octets BIGINT,
    out_octets BIGINT,
    interface_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS system_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level VARCHAR(20),
    title VARCHAR(200),
    message TEXT,
    created_at DATETIME,
    is_read BOOLEAN,
    source VARCHAR(50)
);
""")

# Seed Links
conn.execute("INSERT INTO network_links (name, link_type, capacity_mbps) VALUES ('Backbone Poznan', 'Fiber', 10000)")
conn.execute("INSERT INTO network_links (name, link_type, capacity_mbps) VALUES ('Radio PoP Buk', 'Radio', 1000)")

# Seed Stats
for i in range(20):
    ts = (datetime.utcnow() - timedelta(minutes=i*5)).isoformat()
    cpu = random.randint(5, 40)
    in_oct = random.randint(1000000, 5000000)
    out_oct = random.randint(500000, 2000000)
    conn.execute(f"INSERT INTO network_stats (device_id, timestamp, cpu_usage, in_octets, out_octets, interface_name) VALUES (1, '{ts}', {cpu}, {in_oct}, {out_oct}, 'ether1')")

# Seed Notification
conn.execute("INSERT INTO system_notifications (level, title, message, source, created_at, is_read) VALUES ('warning', 'Wysokie obciazenie', 'Router brzegowy przekroczyl 80% CPU.', 'monitoring', CURRENT_TIMESTAMP, 0)")

conn.commit()
conn.close()
print("Seed finished")
