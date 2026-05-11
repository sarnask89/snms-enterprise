import sqlite3
conn = sqlite3.connect('crm.sqlite')
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [row[0] for row in cursor.fetchall()]
print("Tables:", tables)

if 'customer_devices' in tables:
    cursor.execute("PRAGMA table_info(customer_devices)")
    columns = [row[1] for row in cursor.fetchall()]
    print("Columns in customer_devices:", columns)

if 'node_sessions' in tables:
    cursor.execute("SELECT sql FROM sqlite_master WHERE name='node_sessions'")
    print("Schema node_sessions:", cursor.fetchone()[0])

if 'node_notices' in tables:
    cursor.execute("SELECT sql FROM sqlite_master WHERE name='node_notices'")
    print("Schema node_notices:", cursor.fetchone()[0])

if 'node_group_members' in tables:
    cursor.execute("SELECT sql FROM sqlite_master WHERE name='node_group_members'")
    print("Schema node_group_members:", cursor.fetchone()[0])

conn.close()
