### Podsumowanie

Ten kod implementuje serwis geocodowania polskiego adresu za pomocą GUGiK (Geoportal). Wartość w polsku:

**Serwis geocodowania polskiego adresu za pomocą GUGiK (Geoportal)**

#### Funkcje

1. **geocode_address(city: str, street: str, number: str) -> Optional[Dict[str, float]]**
   - Geocoduje adres w formacie `city, street number` do współrzędnych geograficznych (WGS84).
   - Zwraca słownik z wynikami geocodowania lub `None` jeśli wystąpił błąd.

2. **get_coordinates_for_pit_uke(simc: str, ulic: str, number: str) -> Optional[Dict[str, Any]]**
   - Pobiera współrzędne w układzie PUWG 1992 (EPSG:2180) pod system PIT UKE.
   - Zwraca słownik z wynikami geocodowania lub `None` jeśli wystąpił błąd.

#### Zależności

- **httpx**: Do obsługi HTTP requestów.
- **logging**: Do wypisywania logów.
- **typing**: Do deklaracji typów danych.

#### Struktura kodu

1. **Klasa `GugikGeocodingService`**
   - Wskaźnik do loggera.
   - Definiuje URLi dla UUG i GUGiK API.

2. **Metoda `geocode_address(city: str, street: str, number: str) -> Optional[Dict[str, float]]`**
   - Sprawdza czy wszystkie argumenty są poprawne.
   - Formatuje adres do formatu `city, street number`.
   - Wywołuje GUGiK API do geocodowania.
   - Zwraca słownik z wynikami geocodowania lub `None`.

3. **Metoda `get_coordinates_for_pit_uke(simc: str, ulic: str, number: str) -> Optional[Dict[str, Any]]`**
   - Formatuje adres do formatu `simc_ulic_number`.
   - Wywołuje GUGiK API do geocodowania.
   - Zwraca słownik z wynikami geocodowania lub `None`.

#### Uwagi

- Wartość w polsku:
  **Serwis geocodowania polskiego adresu za pomocą GUGiK (Geoportal)**

- Funkcje:
  - `geocode_address(city: str, street: str, number: str) -> Optional[Dict[str, float]]`
  - `get_coordinates_for_pit_uke(simc: str, ulic: str, number: str) -> Optional[Dict[str, Any]]`

- Zależności:
  - `httpx`
  - `logging`
  - `typing`

- Struktura kodu:
  - Klasa `GugikGeocodingService`
  - Metody `geocode_address` i `get_coordinates_for_pit_uke`

- Uwagi:
  - Wartość w polsku:
    **Serwis geocodowania polskiego adresu za pomocą GUGiK (Geoportal)**