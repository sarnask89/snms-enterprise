### Podsumowanie

Ten kod implementuje funkcje diagnostyczne dla urządzeń w systemie. Wszystkie funkcje korzystają z bibliotek `fastapi`, `sqlalchemy`, `asyncio`, `mikrotik_service` i `dasan_service`. 

#### Funkcja `/diagnostics/check/{device_id}`

1. **Pobranie danych urządzenia**: Zapytanie do bazy danych o urządzenie o podanym identyfikatorze.
2. **Uwierzytelnianie**: Weryfikacja sesji użytkownika.
3. **Zaproponowanie ustawień diagnostycznych**:
   - Ping do IP-adrace i ARP-ping.
   - Znajdź stan dzierżawy (DHCP) i host w brame (bridge).
4. **Renderowanie raportu**: Utworzenie HTML-strony z informacjami diagnostycznymi.

#### Funkcja `/diagnostics/olt-lookup/{device_id}`

1. **Pobranie danych urządzenia**: Zapytanie do bazy danych o urządzenie o podanym identyfikatorze.
2. **Znajdź OLT**:
   - Jeśli urządzenie jest przypisane do węzła klienta, szukanie OLT w tym samym węźle (NetNode).
   - W przeciwnym przypadku, przeskanowanie wszystkich OLT.
3. **Znajdź path do ONU**:
   - Użycie `dasan_service` do zidentyfikowania pathu do ONU.
4. **Renderowanie raportu**: Utworzenie HTML-strony z informacjami diagnostycznymi.

#### Funkcja `/diagnostics/sync-lease/{device_id}`

1. **Pobranie danych urządzenia**: Zapytanie do bazy danych o urządzenie o podanym identyfikatorze.
2. **Znajdź aktywną subskrypcję**:
   - Wyszukiwanie aktywnej subskrypcji klienta.
3. **Uwierzytelnianie**: Weryfikacja sesji użytkownika.
4. **Formatowanie limitu**:
   - Formatowanie limitu przesyłanego do Mikrotiku (Rx/Tx) w odwrotnym porządku niż w CRM.
5. **Zasynchronizowanie ustawień diagnostycznych**:
   - Użycie `mikrotik_service` do zaktualizowania limitu ustawionego na Mikrotiku.
6. **Renderowanie raportu**: Utworzenie HTML-strony z informacjami diagnostycznymi.

### Zależności

- `fastapi`: Wskaźnik do API FastAPI.
- `sqlalchemy`: Kwantumowy model bazy danych SQLAlchemy.
- `asyncio`: Biblioteka asynchroniczna.
- `mikrotik_service`: Skrypt z funkcjami diagnostycznymi dla Mikrotika.
- `dasan_service`: Skrypt z funkcjami diagnostycznymi dla DASAN.
- `decrypt_password`: Funkcja do dekrypcji hasła.

### Struktura kodu

1. **Rozdzielenie funkcji**:
   - `/diagnostics/check/{device_id}`: Diagnostyka pojedynczego urządzenia.
   - `/diagnostics/olt-lookup/{device_id}`: Diagnostyka OLT dla węzła klienta.
   - `/diagnostics/sync-lease/{device_id}`: Synchronizacja limitu diagnostycznego.

2. **Użycie `asyncio.gather`**:
   - Wysłanie wielu zapytań do Mikrotika i DASAN w paralelne.

3. **Renderowanie HTML**:
   - Utworzenie dynamicznej strony z informacjami diagnostycznymi.

4. **Weryfikacja sesji**:
   - Wszystkie funkcje korzystają z `verify_session` do sprawdzenia czy użytkownik jest zalogowany.

5. **Kontrola bazy danych**:
   - Użycie `db.get` i `db.scalar` do pobrania danych z bazy danych.

6. **Dekrypcja hasła**:
   - Wszystkie funkcje korzystają z `decrypt_password` do dekrypcji hasła.

### Przykład użycia

```python
# Importowanie potrzebnych modułów
from fastapi import Fast