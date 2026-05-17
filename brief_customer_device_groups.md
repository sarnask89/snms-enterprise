### Podsumowanie

Ten kod implementuje funkcjonalność zarządzania grupami komputerów w aplikacji. Wszystkie operacje związane z grupami komputerów są dostępne via API FastAPI. 

#### Funkcje i Zależności:

1. **Grupy węzłów**:
   - `node_groups_list`: Lista wszystkich grup komputerów.
   - `node_group_add_alias`: Alias do `/device-groups/new`.
   - `node_group_new_form`: Formularz dodawania nowej grupy komputerów.
   - `node_group_new_submit`: Przetwarzanie formularza dodawania nowej grupy komputerów.
   - `node_group_edit_form`: Formularz edycji istniejącej grupy komputerowej.
   - `node_group_edit_submit`: Przetwarzanie formularza edycji istniejącej grupy komputerowej.
   - `node_group_delete`: Usuwanie istniejącej grupy komputerowej.

2. **Zależności**:
   - `get_db`: Funkcja do pobierania sesji bazy danych.
   - `verify_session`: Funkcja sprawdzająca czy użytkownik ma prawa dostępu do operacji.
   - `require_business_write`: Funkcja sprawdzająca czy użytkownik jest biznesowy i ma prawa zapisu.

3. **Templaty**:
   - `render`: Funkcja do renderowania HTML-stron.

#### Struktura API:

1. **Lista grup komputerów** (`/device-groups`):
   - GET: Lista wszystkich grup komputerów.
   - POST: Alias do `/device-groups/new`.

2. **Formularz dodawania nowej grupy komputerowej** (`/device-groups/add`):
   - GET: Alias do `/device-groups/new`.

3. **Formularz edycji istniejącej grupy komputerowej** (`/device-groups/{group_id}/edit`):
   - GET: Formularz edycji istniejącej grupy komputerowej.
   - POST: Przetwarzanie formularza edycji istniejącej grupy komputerowej.

4. **Usunięcie istniejącej grupy komputerowej** (`/device-groups/{group_id}/delete`):
   - POST: Usuwanie istniejącej grupy komputerowej.

#### Funkcja `_sync_group_nodes`:

- Zapisuje zaktualizowane węzły do bazy danych.
- Przyjmuje obiekt `models.CustomerDeviceGroup` i listę ID węzłów, które mają być dodane lub usunięte.

### Używanie

1. **Lista grup komputerów**:
   - GET: `/device-groups`
   - POST: `/device-groups/add`

2. **Formularz dodawania nowej grupy komputerowej**:
   - GET: `/device-groups/add`

3. **Formularz edycji istniejącej grupy komputerowej**:
   - GET: `/device-groups/{group_id}/edit`
   - POST: `/device-groups/{group_id}/edit`

4. **Usunięcie istniejącej grupy komputerowej**:
   - POST: `/device-groups/{group_id}/delete`

### Przykładowe Użycie

1. **Lista grup komputerów**:
   ```http
   GET /device-groups
   ```

2. **Formularz dodawania nowej grupy komputerowej**:
   ```http
   GET /device-groups/add
   ```

3. **Formularz edycji istniejącej grupy komputerowej**:
   ```http
   GET /device-groups/1/edit
   ```

4. **Usunięcie istniejącej grupy komputerowej**:
   ```http
   POST /device-groups/1/delete
   ```

### Zależności

- `fastapi`
- `sqlalchemy`
- `app.models`
- `app.database`
- `app.deps`
- `app.templating`