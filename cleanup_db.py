import sqlite3
import os

db_path = 'crm.sqlite'
if not os.path.exists(db_path):
    print(f"Database {db_path} not found.")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

queries = [
    "DELETE FROM customer_devices",
    "DELETE FROM subscriptions",
    "DELETE FROM customers WHERE first_name = 'Nieznany' OR first_name = 'Abonent' OR customer_code LIKE 'IMP-%'",
    "DELETE FROM node_sessions",
    "DELETE FROM node_notices",
    "DELETE FROM traffic_stats"
]

for q in queries:
    try:
        cursor.execute(q)
        print(f"Executed: {q}")
    except Exception as e:
        print(f"Error executing {q}: {e}")

conn.commit()
conn.close()
print("Cleanup complete.")
