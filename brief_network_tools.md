### Podsumowanie

Ten kod implementuje funkcjonalności administracyjnych dla zarządzania sieciami. W szczególności:

1. **Rozpoczynanie sesji**:
   - Używa funkcji `verify_session` do sprawdzenia poprawności sesji.

2. **Pobranie listy urządzeń Mikrotik**:
   - Zapytuje się o listę urządzeń Mikrotik w bazie danych, gdzie typ drona jest "mikrotik_v7".
   - Wysyła listę urządzeń do widoku "admin/network_tools.html".

3. **Pobranie wyników skanowania subnetu**:
   - Używa funkcji `network_scanner.scan_subnet` do wyszukiwania urządzeń w podanej sieci.
   - Wysyła listę wyników do widoku "admin/partials/scan_results.html".

4. **Pobranie informacji o sąsiadach urządzenia**:
   - Używa funkcji `network_scanner.discover_neighbors` do wyszukiwania sąsiadów urządzenia w bazie danych.
   - Wysyła listę sąsiadów do widoku "admin/partials/neighbors_list.html".

### Zależności

- **FastAPI**: Do tworzenia API.
- **SQLAlchemy**: Do zarządzania bazą danych.
- **app.database**: Moduł z funkcjami pobierającymi dane z bazy danych.
- **app.deps**: Moduł z funkcjami sprawdzających poprawność sesji i wymaganiem dostępu do biznesowych operacji.
- **app.templating**: Moduł z funkcją renderującą szablony HTML.
- **app.services.network_scanner**: Moduł z funkcjami skanowania sieci i wyszukiwania sąsiadów.
- **app**: Moduł główny, zawierający wszystkie moduły.

### Logowanie

- Używa loggera `logging.getLogger("app.network_tools")` do wypisywania logów.

### Tags

- "network-tools": Tag do identyfikacji tej grupy funkcji.