import sqlite3
conn = sqlite3.connect('crm.sqlite')
total = conn.execute('SELECT COUNT(*) FROM customers').fetchone()[0]
incomplete = conn.execute("SELECT COUNT(*) FROM customers WHERE first_name='Nieznany'").fetchone()[0]
with_net = conn.execute('SELECT COUNT(*) FROM nodes WHERE ip_network_id IS NOT NULL').fetchone()[0]
with_dhcp = conn.execute('SELECT COUNT(*) FROM nodes WHERE dhcp_server IS NOT NULL').fetchone()[0]
print(f'Klientow lacznie: {total}')
print(f'Niekompletnych (bez danych): {incomplete}')
print(f'Wezlow z siecia IP: {with_net}')
print(f'Wezlow z DHCP server: {with_dhcp}')
rows = conn.execute("SELECT hostname, ip_address, dhcp_server, dhcp_interface FROM nodes LIMIT 5").fetchall()
for r in rows:
    print(r)
conn.close()
