import sqlite3
import os

db_path = 'crm.sqlite'
if not os.path.exists(db_path):
    print(f"Error: {db_path} not found")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE monitor_triggers ADD COLUMN last_status VARCHAR(20) DEFAULT 'OK'")
    print("Added last_status")
except Exception as e:
    print(f"Error adding last_status: {e}")

try:
    cursor.execute("ALTER TABLE monitor_triggers ADD COLUMN last_change DATETIME")
    print("Added last_change")
except Exception as e:
    print(f"Error adding last_change: {e}")

try:
    cursor.execute("ALTER TABLE monitor_triggers ADD COLUMN last_value VARCHAR(100)")
    print("Added last_value")
except Exception as e:
    print(f"Error adding last_value: {e}")

conn.commit()
conn.close()
print("Migration completed.")
