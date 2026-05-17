### Podsumowanie

Ten kod implementuje funkcjonalności teretowskiej aplikacji, zgodnie z opisem w treści. W szczególności:

1. **Autosugestie adresów**:
   - Używa `TerytSearchService` do wyszukiwania miejscowosci, ulicy i budynków.
   - Zwraca fragment HTML listy elementów `<li>`, który HTMX wstrzyknie do DOM.

2. **Geocodowanie PUWG 1992**:
   - Używa `GugikGeocodingService` do pobierania współrzędnych PUWG 1992 dla adresu.
   - Przyjmuje nazwy miasta, ulicy i numer budynku.

3. **Pobranie listy miejscowosci**:
   - Używa `LocationCity` modelu z bazy danych do pobrania listy miejscowosci.
   - Supports searching by name.

4. **Dodawanie nowej miejscowości**:
   - Używa `LocationCity` modelu z bazy danych do dodania nowej miejscowości.
   - Requires administrator or manager permissions.

5. **Usuwanie miejscowości**:
   - Używa `LocationCity` modelu z bazy danych do usuwania miejscowości.
   - Requires administrator or manager permissions.

6. **Synchronizacja z Geoportal**:
   - Używa `GugikGeocodingService` do pobierania współrzędnych PUWG 1992 dla adresu.
   - Przyjmuje ID miasta i dodaje nowe budynki do bazy danych.

### Zależności

- **FastAPI**: Wskaźnik do tworzenia aplikacji webowych.
- **SQLAlchemy**: Kwantumeryczna biblioteka do modelowania bazy danych.
- **TerytSearchService**: Skrypt do wyszukiwania miejscowosci, ulicy i budynków.
- **GugikGeocodingService**: Skrypt do pobierania współrzędnych PUWG 1992.

### Struktura kodu

- **Routers**:
  - `router`: Wskaźnik do publicznego routera dla API (autosugestie).
  - `public_api`: Wskaźnik do prywatnego routera dla API (pobranie listy miejscowosci).

- **Autosugestie adresów**:
  - `teryt_suggest`: Endpoint do wyszukiwania adresu.
  - `render`: Funkcja renderująca fragment HTML listy elementów `<li>`.

- **Geocodowanie PUWG 1992**:
  - `teryt_api_geocode_puwg`: Endpoint do pobierania współrzędnych PUWG 1992 dla adresu.
  - `GugikGeocodingService`: Skrypt do pobierania współrzędnych PUWG 1992.

- **Pobranie listy miejscowosci**:
  - `teryt_browse`: Endpoint do wyświetlenia listy miejscowosci.
  - `city_list`: Endpoint do wyszukiwania miejscowości.

- **Dodawanie nowej miejscowości**:
  - `city_new_submit`: Endpoint do dodania nowej miejscowości.
  - `require_admin_or_manager`: Decorator do sprawdzania uprawnień administratora lub miercy.

- **Usuwanie miejscowości**:
  - `city_delete`: Endpoint do usuwania miejscowości.
  - `require_admin_or_manager`: Decorator do sprawdzania uprawnień administratora lub miercy.

- **Synchronizacja z Geoportal**:
  - `teryt_sync_geoportal`: Endpoint do synchronizacji z Geoportal.
  - `GugikGeocodingService`: Skrypt do pobierania współrzędnych PUWG 1992.