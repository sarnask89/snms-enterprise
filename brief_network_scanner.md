### Podsumowanie

Ten kod implementuje funkcje do skanowania sieci, identyfikacji urządzeń i odnalezienia sąsiadów. Wszystkie operacje wykonywane w asynchronicznej kontekście, aby uniknąć blokuowania systemu.

#### Funkcje:

1. **ping_ip(ip: str) -> bool**:
   - Sprawdza czy adres IP jest aktywny.
   - Używa pingu do sprawdzenia poprawności połączenia.

2. **scan_subnet(cidr: str) -> List[Dict[str, Any]]**:
   - Przeskakuje podnet dla wszystkich hostów i próbuje identyfikować je.
   - Wyprowadza wyniki do listy słowników.

3. **scan_single_ip(ip: str) -> Dict[str, Any] | None**:
   - Sprawdza czy adres IP jest aktywny.
   - Jeśli jest, próbuje identyfikować urządzenie za pomocą SNMP.
   - Wyprowadza wynik do słownika lub `None` jeśli nie można identyfikować.

4. **discover_neighbors(db: Session, device_id: int) -> List[Dict[str, Any]]**:
   - Odnajduje sąsiadów z urządzenia zarządzanego przez Mikrotik.
   - Używa protokołów LLDP/CDP/MNDP do odnalezienia sąsiadów.
   - Wyprowadza wyniki do listy słowników.

#### Zależności:

- `asyncio`: Do obsługi asynchronicznych operacji.
- `ipaddress`: Do manipulowania adresami IP.
- `subprocess`: Do uruchamiania polecenia ping.
- `typing`: Do deklarowania typów danych.
- `app.services.snmp_service`: Do wykonywania SNMP identyfikacji.
- `app.services.mikrotik`: Do wykonywania operacji z Mikrotikem.
- `app.security_utils.decrypt_password`: Do dekrypcji hasła.
- `sqlalchemy.orm`: Do manipulowania bazą danych.
- `app.models`: Do definiowania modeli bazy danych.
- `logging`: Do wypisywania logów.

#### Struktura kodu:

1. **NetworkScanner**:
   - Klasa reprezentująca skaner sieci.
   - Wskaźnik do instancji klasy `snmp_service` do wykonywania SNMP identyfikacji.
   - Wskaźnik do instancji klasy `MikrotikService` do wykonywania operacji z Mikrotikem.

2. **ping_ip(ip: str) -> bool**:
   - Używa pingu do sprawdzenia poprawności połączenia.

3. **scan_subnet(cidr: str) -> List[Dict[str, Any]]**:
   - Przeskakuje podnet dla wszystkich hostów i próbuje identyfikować je.
   - Wyprowadza wyniki do listy słowników.

4. **scan_single_ip(ip: str) -> Dict[str, Any] | None**:
   - Sprawdza czy adres IP jest aktywny.
   - Jeśli jest, próbuje identyfikować urządzenie za pomocą SNMP.
   - Wyprowadza wynik do słownika lub `None` jeśli nie można identyfikować.

5. **discover_neighbors(db: Session, device_id: int) -> List[Dict[str, Any]]**:
   - Odnajduje sąsiadów z urządzenia zarządzanego przez Mikrotik.
   - Używa protokołów LLDP/CDP/MNDP do odnalezienia sąsiadów.
   - Wyprowadza wyniki do listy słowników.