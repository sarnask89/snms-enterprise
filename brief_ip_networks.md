### Podsumowanie

Ten kod implementuje funkcjonalność zarządzania sieciami IP w aplikacji. Wszystkie operacje to wykonywane na bazie bazy danych SQLAlchemy, a interfejs użytkownika jest dostarczany przez FastAPI.

#### Funkcje i Zależności

1. **`ip_network_list`**:
   - Pobiera listę sieci IP z bazy danych.
   - Wyszukuje siece IP w bazie danych po podanych parametrach (nazwa, CIDR, brama, opis, VLAN).
   - Zlicza liczby urządzeń na każdej sieci.
   - Renderuje stronę listy sieci IP.

2. **`ip_network_search_form`**:
   - Wyskakuje formularz wyszukiwania sieci IP.

3. **`ip_network_add_alias`**:
   - Przekierowywa do formularza dodawania nowej sieci IP.

4. **`ip_network_usage`**:
   - Pobiera listę wszystkich sieci IP.
   - Pobiera listę urządzeń na każdej sieci.
   - Wyszukuje, które urządzenia są na każdej z sieci.
   - Renderuje stronę wykorzystania sieci IP.

5. **`ip_network_new_form`**:
   - Przekierowywa do formularza dodawania nowej sieci IP.

6. **`_opt_int`**:
   - Funkcja parsująca wartość z formularza, aby przekazać jako int.

7. **`ip_network_new_submit`**:
   - Dodaje nową sieć IP do bazy danych.

8. **`ip_network_edit_form`**:
   - Przekierowywa do formularza edycji sieci IP.

9. **`ip_network_edit_submit`**:
   - Edytuje existującą sieć IP w bazie danych.

10. **`ip_network_delete`**:
    - Usuwa sieć IP z bazy danych i usuwa wszystkie powiązane urządzenia i klientów.

#### Zależności

- `fastapi`: Wskaźnik do FastAPI.
- `sqlalchemy`: Wskaźnik do SQLAlchemy.
- `app.models`: Modely bazy danych.
- `app.database`: Funkcje do pobierania bazy danych.
- `app.deps`: Funkcje do sprawdzania sesji i dostępu do biznesowych uprawnień.
- `app.templating`: Funkcja do renderowania stron HTML.

#### Używanie

1. **Pobranie listy sieci IP**:
   - `/ip-networks`

2. **Wyszukiwanie sieci IP**:
   - `/ip-networks/search?q=<search_query>`

3. **Dodawanie nowej sieci IP**:
   - `/ip-networks/add`

4. **Wykorzystanie sieci IP**:
   - `/ip-networks/usage`

5. **Edycja sieci IP**:
   - `/ip-networks/{net_id}/edit`

6. **Usuwanie sieci IP**:
   - `/ip-networks/{net_id}/delete`