import sqlite3

conn = sqlite3.connect('crm.sqlite')
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND (name='nodes' OR name='customer_devices');")
tables = cursor.fetchall()

if not tables:
    print("Neither 'nodes' nor 'customer_devices' table exists!")
else:
    for table in tables:
        print(f"Table found: {table[0]}")
        cursor.execute(f"PRAGMA table_info({table[0]})")
        columns = cursor.fetchall()
        for col in columns:
            print(f"  - {col[1]} ({col[2]})")

conn.close()
