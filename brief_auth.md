### Podsumowanie

Ten kod implementuje funkcjonalność logowania i zmiany hasła w aplikacji. Wszystkie operacje wykonywane przez ten kod są zapisywane do bazy danych za pomocą metody `record_audit`. 

#### Funkcje:

1. **Login:**
   - Pobiera dane użytkownika z formularza.
   - Sprawdza, czy użytkownik istnieje i jest aktywny.
   - Hashuje wprowadzone hasło i sprawdza, czy jest poprawne.
   - Jeśli wszystko się zgadza, tworzy nową sesję i przekierowuje do głównego strony.

2. **Logout:**
   - Usuwa dane użytkownika z sesji.
   - Zapisuje akcję logowania w baze danych.

3. **Zmiana hasła:**
   - Pobiera dane nowego hasła i potwierdzenie tego hasła.
   - Sprawdza, czy nowe hasło ma minimum 6 znaków.
   - Sprawdza, czy aktualne hasło jest poprawne.
   - Hashuje nowe hasło i zapisuje go do bazy danych.

#### Zależności:

- `fastapi`: Wskaźnik do biblioteki FastAPI, która służy jako framework webu.
- `sqlalchemy`: Biblioteka SQLAlchemy do zarządzania bazą danych.
- `app.models`, `app.audit`, `app.database`, `app.deps`, `app.security`, `app.templating`: Moduły zawierające definicje modeli bazy danych, funkcjonalności auditowania, dostępu do bazy danych, sprawdzanie sesji i hasła, oraz renderowanie szablonów HTML.
- `request`: Obiekt żądania HTTP.

#### Struktura kodu:

1. **Rozdzielenie logiki:**
   - Wszystkie funkcje związane z logowaniem i zmianą hasła są zapisywane w osobnych routach (`/login`, `/logout`, `/auth/change-password`).

2. **Użycie dekoratorów:**
   - `@router.get("/login", response_class=HTMLResponse)` i `@router.post("/login", response_class=HTMLResponse)` są używane do definiowania routów GET i POST, odpowiednio dla logowania i zmiany hasła.

3. **Użycie dekoratorów z autoryzacją:**
   - `@router.get("/auth/change-password", response_class=HTMLResponse, dependencies=[Depends(verify_session)])` jest używany do definiowania routu GET dla zmiany hasła, który wymaga autoryzacji.

4. **Użycie dekoratorów z formularzem:**
   - `@router.post("/login", response_class=HTMLResponse)` i `@router.post("/auth/change-password", response_class=HTMLResponse)` są używane do definiowania routów POST dla logowania i zmiany hasła, które wymagają przesyłania danych formularza.

5. **Użycie dekoratorów z renderowaniem szablonów:**
   - `render(request, "login.html", {"error": None})` i `render(request, "auth/change_password.html", {"title": "Zmiana hasła", "error": None})` są używane do renderowania szablonów HTML.

6. **Użycie dekoratorów z autoryzacją:**
   - `@router.get("/auth/change-password", response_class=HTMLResponse, dependencies=[Depends(verify_session)])` jest używany do definiowania routu GET dla zmiany hasła, który wymaga autoryzacji.

7. **Użycie dekoratorów z formularzem:**
   - `@router.post("/login", response_class=HTMLResponse)` i `@router.post("/auth/change-password", response_class=HTMLResponse)` są używane do definiowania routów POST dla logowania i zmiany hasła, które wymagają przesyłania danych formularza.

8. **Użycie dekoratorów z renderowaniem szablonów:**
   - `render(request, "login.html", {"error": None})` i `render(request, "auth/change_password.html", {"title": "Zmiana hasła", "error": None})` są używane do renderowania szablonów HTML.

9. **Użycie dekoratorów z autoryzacją:**
   - `@router.get("/auth/change-password",