Ten kod jest funkcją w FastAPI, która renderuje szablon HTML na podstawie danych. Wartość zwracana to obiekt `Response`, który zawiera przekonany HTML i opcjonalnie kod stanu HTTP.

### Funkcja `render`

1. **Pobranie danych**:
   - Odczytuje dane z żądania HTTP (`request`).
   - Pobiera informacje o użytkowniku (`portal_user`) i klienta (`client_user`) z obiektu `state`.
   - Wczytuje elementy nawigacji z bazy danych (jedna dla każdego użytkownika) lub z pamięci podręcznej.

2. **Ustawienie kontekstu**:
   - Dodaje informacje o użytkowniku i klienta do kontekstu renderowania.
   - Ustawia flagi na podstawie roli użytkownika (`can_write_crm`, `can_write_helpdesk`, `can_write_messages`).

3. **Ustawienie zmiennych w kontekście**:
   - Dodaje informacje o nazwie aplikacji i nazwie displayu.
   - Ustawia kluczowe klucze do widoku (`visible_menu_keys`).

4. **Integrowanie UI Pluginów**:
   - Pobiera assets UI pluginów z obiektu `ui_service`.
   - Pobiera ścieżki breadcrubów z obiektu `ui_service`.

5. **Renderowanie szablonu**:
   - Używa obiektu `templates` do renderowania szablonu o nazwie podanej w argumentach (`name`) z kontekstem.
   - Ustawia kod stanu HTTP, jeśli ten jest przekazywany.

### Zależności

- **FastAPI**: Wskaźnik do funkcji `Request` i `Jinja2Templates`.
- **jinja2**: Wskaźnik do klasy `Environment` z ustawionymi loaderem plików i dopasowanymi do dołączania modułów.
- **app.config**: Konfiguracja aplikacji, w tym nazwę displayu (`APP_DISPLAY_NAME`) i katalog główny (`BASE_DIR`).
- **app.database**: Klasa `db_manager.SessionLocal`, która pozwala na zarządzanie sesjami bazy danych.
- **app.models**: Model `UserRole`.
- **app.nav_access**: Funkcje `grouped_visible_nav` i `visible_nav_items`.
- **app.services.ui_service**: Wskaźnik do funkcji `ui_service.get_theme_assets` i `ui_service.get_breadcrumb`.

### Używanie

W celu wykorzystania tej funkcji, należy zainstalować potrzebne pakiety:

```bash
pip install fastapi jinja2
```

Następnie, w pliku `main.py` lub gdzieś w kodzie głównym, dodaj następujący kod:

```python
from app import render

# Przykładowe wywołanie funkcji render
response = render(
    request=request,
    name="index.html",
    context={"message": "Hello, World!"}
)
```

W tym przykładzie `request` jest obiektem żądania HTTP, `name` to nazwa szablonu HTML, a `context` to słownik z danymi do przekazania do szablonu.