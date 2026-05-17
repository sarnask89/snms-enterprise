### Przeanalizowanie kodu

#### Funkcje i Zależności

1. **MikrotikService**:
   - Konstruktor: Inicjalizuje obiekt z hostem, użytkownikiem, hasłem i portem.
   - `_get_api`: Utwóra połączenie do MikroTika za pomocą `routeros_api`.
   - `get_leases`, `get_ip_addresses`, `get_interfaces`, `get_ip_pools`, `get_dhcp_servers`, `get_dhcp_networks`: Pobierają informacje o dzierżawach DHCP, adresach IP, interfejsach, poolach IP, serwerach DHCP i sieciach DHCP.
   - `upsert_static_lease`: Dodaje lub aktualizuje statyczną dzierżawę DHCP.
   - `remote_ping`, `remote_arp_ping`: Wykonywują ping ICMP z routera do celu i ARP ping, automatycznie wykrywa interfejs z tablicy ARP.
   - `get_lease_info`, `get_bridge_host_info`: Pobierają informacje o dzierżawach DHCP dla danego adresu MAC i sprawdza czy adres MAC jest widoczny w tablicy hostów bridge.
   - `get_neighbors`: Pobiera listę sąsiadów wykrytych przez protokoły discovery (MNDP, LLDP, CDP).

2. **asyncio.to_thread**: Używane do wykonywania funkcji na wątku zaimplementowanym w Pythonie.

#### Struktura kodu

1. **Logging**: Używanie `logging` do logowania informacji i błędów.
2. **API Pool**: Użycie `routeros_api.RouterOsApiPool` do tworzenia połączenia do MikroTika.
3. **Asynchroniczne Wykonywanie**: Wszystkie metody są asynchroniczne, aby obsługiwać wiele zapytań simultaneously.

#### Zależności

- `routeros_api`: Biblioteka do komunikacji z MikroTika.
- `asyncio`: Biblioteka do asynchronicznego programowania w Pythonie.
- `typing`: Typing dla typów danych.

### Podsumowanie

Ten kod implementuje funkcjonalność zarządzania dzierżawami DHCP, adresami IP, interfejsami, poolami IP, serwerami DHCP i sieciach DHCP na MikroTika. Wszystkie operacje są asynchroniczne, aby obsługiwać wiele zapytań simultaneously. Logowanie informacji i błędów jest wykonywane za pomocą `logging`.