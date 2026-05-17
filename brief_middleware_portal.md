### Podsumowanie

Ten kod implementuje middleware dla aplikacji webowej, który sprawdza dostęp do różnych ścieżek w zależności od typu sesji (admin lub klient) i roli użytkownika. Wszystkie metody HTTP są kontrolowane przez ten middleware.

#### Funkcje:

1. **_auth_enabled()**: Zwraca `True` jeśli autentykacja jest włączona, w przeciwnym razie `False`.
2. **_path_open(path)**: Sprawdza czy ścieżka jest zezwolona dla użytkownika.
3. **PortalUserMiddleware**:
   - Inicjalizuje obiekty w request.state.
   - Sprawdza autentykację admina i klienta.
   - Ustawia obiekty `portal_user`, `client_user`, `visible_url_prefixes` i `visible_menu_keys`.
   - Sprawdza dostęp do ścieżek dla użytkownika.

#### Zależności:

- **os**: Do pobierania zmiennych środowiskowych.
- **starlette.middleware.base.BaseHTTPMiddleware**: Wskaźnik do klasy bazowej middleware.
- **starlette.responses.HTMLResponse**: Rezultat, gdy użytkownik nie ma dostępu do ścieżki.
- **app.database.db_manager**: Klasa do zarządzania baza danych.
- **app.models**: Modely bazy danych.
- **app.nav_access.path_allowed_for_portal**: Funkcja do sprawdzenia czy ścieżka jest zezwolona dla użytkownika.
- **app.config.AUTH_ENABLED**: Zmienna środowiskowa, która kontroluje autentykację.

#### Struktura kodu:

1. **Funkcje wewnętrzne**:
   - `_auth_enabled()`: Właściwa funkcja sprawdzająca autentykację.
   - `_path_open(path)**: Sprawdza czy ścieżka jest zezwolona dla użytkownika.

2. **Klasa middleware**:
   - `PortalUserMiddleware` dziedzina od `BaseHTTPMiddleware`.
   - Implementuje metody `dispatch`, które są wywoływane przy każdym żądaniu.
   - Ustawia obiekty w request.state i sprawdza dostęp do ścieżek.

3. **Zależności**:
   - Importuje potrzebne moduły i klasy z pakietów `starlette` i `app`.

### Przykład użycia:

```python
from fastapi import FastAPI

app = FastAPI()

@app.middleware("http")
async def portal_user_middleware(request, call_next):
    # Middleware logic here
    pass
```

W tym przykładzie middleware jest dodawany do aplikacji FastAPI za pomocą `@app.middleware("http")`.