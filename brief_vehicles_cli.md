### Podsumowanie kodu

Ten kod jest aplikacją FastAPI, która obsługuje interakcję z bazą danych SQLAchemy. W tym przypadku, aplikacja zarządza listą flotów CLI (Flota Car Information List) w formacie HTML.

#### Funkcje i zależności:

1. **get_db**: Zwraca sesję bazy danych.
2. **verify_session**: Sprawdza czy użytkownik jest zalogowany.
3. **render**: Renderuje szablon HTML.
4. **models**: Modely bazy danych.

#### Endpoints:

- `/vehicles-cli`: Pobiera listę flotów CLI.
- `/vehicles-cli/new`: Tworzy nową flocę CLI.
- `/vehicles-cli/{item_id}/edit`: Edytuje istniejącą flocę CLI.
- `/vehicles-cli/{item_id}/delete`: Usuwa istniejącą flocę CLI.

#### Funkcje:

1. **vehicles_cli_list**: Pobiera listę flotów CLI z bazy danych i renderuje szablon HTML "generated/vehicles_cli_list.html".
2. **vehicles_cli_new**: Renderuje szablon HTML "generated/vehicles_cli_form.html" do tworzenia nowej flocy CLI.
3. **vehicles_cli_new_submit**: Tworzy nową flocę CLI w bazie danych i przekierowuje na listę flotów CLI.
4. **vehicles_cli_edit**: Renderuje szablon HTML "generated/vehicles_cli_form.html" do edycji istniejącej flocy CLI.
5. **vehicles_cli_edit_submit**: Edytuje istniejącą flocę CLI w bazie danych i przekierowuje na listę flotów CLI.
6. **vehicles_cli_delete**: Usuwa istniejącą flocę CLI z bazy danych i przekierowuje na listę flotów CLI.

### Struktura kodu:

- **models.py**: Definiuje model bazy danych `VehiclesCli`.
- **database.py**: Zwraca sesję bazy danych.
- **deps.py**: Włącza funkcje zabezpieczające session.
- **templates/generated/vehicles_cli_list.html**: Szablon HTML listy flotów CLI.
- **templates/generated/vehicles_cli_form.html**: Szablon HTML formularza do tworzenia i edycji flocy CLI.

### Używanie:

1. Zainstaluj pakiet FastAPI:
   ```bash
   pip install fastapi uvicorn
   ```

2. Stwórz plik `main.py` z kodem wskazanym powyżej.

3. Uruchom aplikację:
   ```bash
   uvicorn main:app --reload
   ```

4. Użyj przeglądarki do otworzenia adresu URL `/vehicles-cli` i przetestuj funkcje.