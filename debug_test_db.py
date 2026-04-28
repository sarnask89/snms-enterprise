import sqlite3

def check_test_db():
    conn = sqlite3.connect("crm-portal/test_crm.sqlite")
    cursor = conn.cursor()
    
    print("--- CITIES ---")
    cities = cursor.execute("SELECT id, name FROM location_cities").fetchall()
    for c in cities:
        print(c)
        
    print("--- STREETS ---")
    streets = cursor.execute("SELECT id, name, city_id FROM location_streets").fetchall()
    for s in streets:
        print(s)
        
    conn.close()

if __name__ == "__main__":
    check_test_db()
