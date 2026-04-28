import sqlite3

def update_db():
    conn = sqlite3.connect("crm-portal/crm.sqlite")
    cursor = conn.cursor()
    
    # 1. Update customers table
    try:
        cursor.execute("ALTER TABLE customers ADD COLUMN x_1992 NUMERIC(12, 2)")
        print("Added x_1992 to customers")
    except sqlite3.OperationalError:
        print("x_1992 already exists in customers")

    try:
        cursor.execute("ALTER TABLE customers ADD COLUMN y_1992 NUMERIC(12, 2)")
        print("Added y_1992 to customers")
    except sqlite3.OperationalError:
        print("y_1992 already exists in customers")
        
    # 2. Update net_nodes table
    try:
        cursor.execute("ALTER TABLE net_nodes ADD COLUMN x_1992 NUMERIC(12, 2)")
        print("Added x_1992 to net_nodes")
    except sqlite3.OperationalError:
        print("x_1992 already exists in net_nodes")

    try:
        cursor.execute("ALTER TABLE net_nodes ADD COLUMN y_1992 NUMERIC(12, 2)")
        print("Added y_1992 to net_nodes")
    except sqlite3.OperationalError:
        print("y_1992 already exists in net_nodes")
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    update_db()
