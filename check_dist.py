import sqlite3
conn = sqlite3.connect('crm.sqlite')
rows = conn.execute("SELECT first_name, COUNT(*) as cnt FROM customers GROUP BY first_name ORDER BY cnt DESC").fetchall()
for r in rows:
    print(r)
conn.close()
