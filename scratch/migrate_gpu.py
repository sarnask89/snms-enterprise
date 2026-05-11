import sqlite3
import os

db_path = 'crm.sqlite'
if not os.path.exists(db_path):
    print(f"Error: {db_path} not found")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS nvidia_gpus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        uuid VARCHAR(100) UNIQUE NOT NULL,
        vram_total_mb INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT 1
    )
    """)
    print("Created table nvidia_gpus")
except Exception as e:
    print(f"Error creating nvidia_gpus: {e}")

try:
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS nvidia_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gpu_id INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        utilization_gpu INTEGER,
        utilization_mem INTEGER,
        vram_used_mb INTEGER,
        temperature INTEGER,
        power_draw_w FLOAT,
        FOREIGN KEY(gpu_id) REFERENCES nvidia_gpus(id) ON DELETE CASCADE
    )
    """)
    print("Created table nvidia_stats")
except Exception as e:
    print(f"Error creating nvidia_stats: {e}")

conn.commit()
conn.close()
print("GPU Migration completed.")
