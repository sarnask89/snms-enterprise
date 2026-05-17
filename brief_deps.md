### Podsumowanie

Ten kod implementuje funkcje autoryzacji w aplikacji, korzystając z biblioteki FastAPI. Wszystkie funkcje sprawdzają czy autoryzacja jest włączona i sprawdzają, czy użytkownik ma odpowiednią rolę do wykonania określonego działania.

#### Funkcje:

1. **_auth_enabled()**:
   - Odczytuje zmienną środowiskowej `AUTH_ENABLED`.
   - Zwraca `True` jeśli `AUTH_ENABLED` jest ustawiona na wartość "true" lub "1", w przeciwnym razie `False`.

2. **login_required(request: Request)**:
   - Sprawdza, czy autoryzacja jest włączona.
   - Jeśli nie, zwraca HTTP 303 SEE OTHER do `/login`.
   - Jeśli jest włączona, sprawdza, czy użytkownik ma obecnie zalogowany kontekst (`portal_user`).
   - Jeśli nie, zwraca HTTP 403 FORBIDDEN.

3. **verify_session(request: Request)**:
   - Wywołuje `login_required`.

4. **require_can_mutate(request: Request)**:
   - Kompatybilność z funkcją `require_business_write`.
   - Sprawdza, czy użytkownik ma odpowiednią rolę do wykonania określonego działania.
   - Jeśli nie, zwraca HTTP 403 FORBIDDEN.

5. **require_business_write(request: Request)**:
   - Zapis danych biznesowych (klienci, finanse, dokumenty, sieci, urządzenia) — admin lub manager.
   - Sprawdza, czy użytkownik ma odpowiednią rolę do wykonania określonego działania.
   - Jeśli nie, zwraca HTTP 403 FORBIDDEN.

6. **require_helpdesk_write(request: Request)**:
   - Tworzenie i edycja zgłoszeń — admin, manager lub service.
   - Sprawdza, czy użytkownik ma odpowiednią rolę do wykonania określonego działania.
   - Jeśli nie, zwraca HTTP 403 FORBIDDEN.

7. **require_messaging_write(request: Request)**:
   - Wiadomości i szablony — admin, manager, service (nie view).
   - Sprawdza, czy użytkownik ma odpowiednią rolę do wykonania określonego działania.
   - Jeśli nie, zwraca HTTP 403 FORBIDDEN.

8. **require_admin(request: Request)**:
   - Wymagana rola administratora.
   - Sprawdza, czy użytkownik ma odpowiednią rolę do wykonania określonego działania.
   - Jeśli nie, zwraca HTTP 403 FORBIDDEN.

9. **require_admin_or_manager(request: Request)**:
   - Wymagana rola administratora lub manager.
   - Sprawdza, czy użytkownik ma odpowiednią rolę do wykonania określonego działania.
   - Jeśli nie, zwraca HTTP 403 FORBIDDEN.

10. **require_client(request: Request)**:
    - Sprawdza, czy użytkownik jest zalogowany jako klient.
    - Jeśli nie, zwraca HTTP 303 SEE OTHER do `/client/login`.

### Zależności:

- `os`: Do odczytania zmiennych środowiskowych.
- `fastapi`: Do obsługi żądań HTTP i wywołania funkcji.
- `app.models`: Model obiektu użytkownika.

### Używanie:

1. **Autoryzacja**:
   - Funkcje `login_required`, `verify_session`, `require_can_mutate`, `require_business_write`, `require_helpdesk_write`, `require_messaging_write`, `require_admin`, `require_admin_or_manager`, i `require_client` sprawdzają, czy autoryzacja jest włączona i czy użytkownik ma odpowiednią rolę do wykonania określonego działania.

2. **Zapis danych biznesowych**:
   - Funkcje `require_business_write` sprawdza, czy użytkownik ma odpowiednią rolę do zapisu danych biznesowych.

3. **Tworzenie i edycja zgłoszeń**:
   - Funkcje `require_helpdesk_write` sprawdza, czy użytkownik ma odpowiednią rolę do tworzenia i edycji zgłoszeń.

4. **Wiadomości i szablony**:
   - Funkcje `require_messaging_write` sprawdza, czy użytkownik ma odpowiednią rolę do wysyłania wiadomości i edycji szablonów.

