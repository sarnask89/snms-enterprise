### Podsumowanie

Ten kod jest aplikacją FastAPI, która dostarcza statystyczne i raporty dla administratora systemu. Wszystkie funkcje są zaimplementowane w klasach `Router` i wykorzystują modeli SQLAlchemy do interakcji z bazą danych.

#### Funkcje:

1. **/admin/stats/network-health**:
   - Zwraca historię stanu sieci w formacie JSON.
   - Generuje 24 godzin historii, gdzie dla każdego часа jest losowa zmiana liczby online устройств i odchylenie standardowe pakietów przesyłanych.

2. **/admin/stats/customer-traffic/{customer_id}**:
   - Zwraca raport kierunkowego trasy dla określonego klienta.
   - Generuje 24 godzin historii, gdzie dla każdego часа jest losowa liczba pakietów przesyłanych i odbieranych.

3. **/admin/stats/financial-summary**:
   - Zwraca raport finansowy na podstawie ostatnich 12 miesięcy.
   - Generuje 12 godzin historii, gdzie dla każdego miesiąca jest losowa liczba przychodów i kosztów.

4. **/admin/stats/inventory-summary**:
   - Simulacja raportu inventarza urządzeń.
   - Zwraca listę modeli urządzeń i ich liczbą.

5. **/admin/stats/customer-growth**:
   - Zwraca raport rozwijania klientów na podstawie ostatnich 6 miesięcy.
   - Generuje 6 godzin historii, gdzie dla każdego miesiąca jest losowa liczba nowych klientów.

6. **/admin/stats/notifications-count**:
   - Zwraca liczbę nieodczytanych notifikacji systemu.
   - Jeśli brak nieodczytanych notifikacji, zwraca pustą odpowiedź.

7. **/admin/stats/notifications-list**:
   - Zwraca listę ostatnich 5 nieodczytanych notifikacji systemu.
   - Używa komponentu `notification_list_fragment.html` do renderowania listy notifikacji.

### Zależności:

- **FastAPI**: Wskaźnik do tworzenia aplikacji FastAPI.
- **SQLAlchemy**: Kwantel do interakcji z bazą danych SQLAlchemy.
- **app.database**: Moduł zawierający funkcję `get_db`, która dostarcza połączenie z bazą danych.
- **app.models**: Modeli SQLAlchemy, które definiują struktury tabel w bazie danych.
- **app.templating**: Moduł zawierający funkcję `render`, która renderuje komponenty HTML.
- **sqlalchemy**: Kwantel do wykonywania SQL zapytań.
- **datetime**: Kwantel do manipulacji datami i godzinami.

### Struktura kodu:

1. **Rozdzielenie funkcji**:
   - Wszystkie funkcje są zaimplementowane w klasach `Router` i wykorzystują modeli SQLAlchemy.

2. **Historia danych**:
   - Historia stanu sieci, trasy klienta, finansowy raport, inventarz i rozwijanie klientów generuje losowe wartości.

3. **Komponenty HTML**:
   - Komponent `notification_badge.html` jest używany do renderowania liczby nieodczytanych notifikacji.
   - Komponent `notification_list_fragment.html` jest używany do renderowania listy ostatnich 5 nieodczytanych notifikacji.

4. **Pomocnicze funkcje**:
   - Funkcja `get_db` dostarcza połączenie z bazą danych.
   - Funkcja `render` renderuje komponenty HTML.

### Przykład użycia:

- Aby uzyskać historię stanu sieci, można wywołać `/admin/stats/network-health`.
- Aby uzyskać raport kierunkowego trasy dla klienta, należy podać identyfikator klienta w URL, np. `/admin/stats/customer-traffic/123`.

### Wersja:

- Kod został zaimplementowany na Python 3.8.
- Użyto SQLAlchemy 2.0.
- Kwantel do interakcji z bazą danych SQLAlchemy jest używany.

### Przykładowy output:

```json
{
    "history": [
        {
            "time": "19:00",
            "online": 8,
