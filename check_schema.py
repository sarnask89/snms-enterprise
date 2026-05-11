import sqlite3

def check_schema():
    conn = sqlite3.connect('crm.sqlite')
    cursor = conn.cursor()
    
    print("--- TABLES ---")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [t[0] for t in cursor.fetchall()]
    for t in tables:
        print(f"Table: {t}")
        cursor.execute(f"PRAGMA table_info({t})")
        cols = cursor.fetchall()
        for c in cols:
            print(f"  Col: {c[1]} ({c[2]})")
            
    conn.close()

if __name__ == "__main__":
    check_schema()
