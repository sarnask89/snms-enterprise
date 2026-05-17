### Podsumowanie Użytych Funkcji i Zależności

#### Funkcja `get_discoverable_leases`
- **Zawartość**: Pobiera dzierżawy z Mikrotika i przygotowuje je do wyświetlenia w UI Discovery.
- **Użycie**:
  - Przyjmuje obiekt `db` (sessję bazy danych) i `device` (modelu urządzenia).
  - Wyprowadza log informacyjny o rozpoczęciu procesu odkrywania dla danego urządzenia.
  - Dekryptuje hasło do zarządzania Mikrotika.
  - Używa klasy `MikrotikService` do pobrania listy dzierżaw z mikrotika.
  - Przetwarza dane dzierżawy, sprawdza czy IP należy do sieci przypisanych do urządzenia.
  - Sprawdza czy ten MAC już istnieje w CRM.
  - Parsuje komentarz i próbuje dopasowania danych.
  - Ustawia informacje o stanie urządzenia w bazie.
  - Zwraca listę pozycji, które są przypisane do dzierżawy.

#### Funkcja `sync_device_config`
- **Zawartość**: Synchronizuje konfigurację interfejsów, pul adresów i serwerów DHCP z Mikrotika do CRM.
- **Użycie**:
  - Przyjmuje obiekt `db` (sessję bazy danych) i `device` (modelu urządzenia).
  - Wyprowadza log informacyjny o rozpoczęciu synchronizacji konfiguracji dla danego urządzenia.
  - Dekryptuje hasło do zarządzania Mikrotika.
  - Używa klasy `MikrotikService` do pobrania listy interfejsów, pul adresów i serwerów DHCP.
  - Aktualizuje informacje o interfejsach w bazie.
  - Aktualizuje informacje o pul adresów w bazie.
  - Aktualizuje informacje o serwerach DHCP w bazie.

#### Funkcja `get_discoverable_networks`
- **Zawartość**: Pobiera podsieci z serwera DHCP Mikrotika i przygotowuje je do importu jako `IpNetwork` do CRM.
- **Użycie**:
  - Przyjmuje obiekt `db` (sessję bazy danych) i `device` (modelu urządzenia).
  - Wyprowadza log informacyjny o rozpoczęciu odkrywania podsieci DHCP dla danego устройства.
  - Dekryptuje hasło do zarządzania Mikrotika.
  - Używa klasy `MikrotikService` do pobrania listy podsieci z mikrotika.
  - Sprawdza czy CIDR jest już przypisany do urządzenia w bazie.
  - Przetwarza dane podsieci, sprawdza czy IP należy do sieci przypisanych do urządzenia.
  - Ustawia informacje o stanie podsieci w bazie.
  - Zwraca listę pozycji, które są przypisane do podsieci.

### Zależności

- **`logging`**: Do logowania informacji i błędów.
- **`ipaddress`**: Do manipulacji adresami IP.
- **`sqlalchemy`**: Do interakcji z bazą danych.
- **`app.models`**: Modelu bazy danych.
- **`app.services.mikrotik`**: Klasa do zarządzania Mikrotika.
- **`app.services.mikrotik_parser`**: Klasa do parsowania komentarza z mikrotika.
- **`app.security_utils`**: Klasa do dekrypcji hasła.

### Struktura Kodu

1. **Funkcja `get_discoverable_leases`**:
   - Wyprowadza log informacyjny o rozpoczęciu procesu odkrywania.
   - Dekryptuje hasło.
   - Używa klasy `MikrotikService` do pobrania listy dzierżaw.
   - Przetwarza dane, sprawdza sieci i MAC-ów.

2. **Funkcja `sync_device_config`**:
   - Wyprowadza log informacyjny o rozpoczęciu synchronizacji.
   - Dekryptuje hasło.
   - Używa klasy `MikrotikService` do pobrania listy interfejsów, pul adresów