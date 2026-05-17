Ten kod jest implementacją serwisu notyfikacji w aplikacji. Wartość podsumowania:

1. **Klasa `NotificationService`**:
   - Zawiera metody statyczne do obsługi operacji na notyfikacjach.
   - `notify(title, message, level="info", source="system")`: Tworzy nową notyfikację w bazie danych i commituje zmiany. Pozwala na ustawienie informacji o poziomie notyfikacji (domyślnie "info"), źródle (domyślnie "system") oraz tytułu i treści notyfikacji.
   - `get_unread_count()`: Zwraca liczbę nieodczytanych notyfikacji w bazie danych. Jeśli brak nieodczytanych, zwraca 0.

2. **Kluczowe funkcje**:
   - `SessionLocal()` - Używana do tworzenia obiektu sesji bazy danych.
   - `SystemNotification` - Model notyfikacji w bazie danych.
   - `sa.select(sa.func.count(SystemNotification.id)).where(SystemNotification.is_read == False)` - Zwraca liczbę nieodczytanych notyfikacji.

3. **Użycie**:
   - Tworzenie instancji klasy `NotificationService`.
   - Wywołanie metody `notify` do wysyłania notyfikacji.
   - Wywołanie metody `get_unread_count` do sprawdzenia liczby nieodczytanych notyfikacji.

4. **Zależności**:
   - `app.database`: Moduł bazy danych, który zawiera definicję klasy `SessionLocal`.
   - `app.models.monitoring`: Model notyfikacji w bazie danych.
   - `sqlalchemy`: Biblioteka do tworzenia i zarządzania bazą danych.

5. **Zasoby**:
   - Baza danych: SQLite lub PostgreSQL, zależna od konfiguracji aplikacji.
   - SQLAlchemy: Do interakcji z bazą danych.
   - Notyfikacje: Model w bazie danych do przechowywania informacji o notyfikacjach.

6. **Przykładowe użycie**:
   ```python
   notification_service = NotificationService()
   notification_service.notify("Uwaga", "Oto ważna nota.")
   unread_count = notification_service.get_unread_count()
   print(f"Liczba nieodczytanych notyfikacji: {unread_count}")
   ```

7. **Zasady działania**:
   - Klasa `NotificationService` jest statyczna, co oznacza, że można ją wywołać bez instancji klasy.
   - Metody `notify` i `get_unread_count` są statyczne, co oznacza, że nie potrzebują obiektu sesji bazy danych.

8. **Zasady bezpieczeństwa**:
   - W metodzie `notify`, nie jest sprawdzana czy użytkownik ma uprawnienia do wysyłania notyfikacji.
   - Nie jest sprawdzana czy notyfikacja została poprawnie zapisана w bazie danych.

9. **Zasady eficiency**:
   - Metoda `get_unread_count` wykorzystuje metodę `scalar`, która ma znaczenie dla eficiencji bazy danych, ponieważ nie tworzy obiektu SQLAlchemy.

10. **Zasady komunikacji**:
    - W metodzie `notify`, nie jest sprawdzana czy notyfikacja została wysłana poprawnie do użytkownika.
    - Nie jest sprawdzana czy notyfikacja została przetworzona na serwerze.

11. **Zasady zabezpieczenia**:
    - W metodzie `notify`, nie jest sprawdzana czy notyfikacja została wysłana poprawnie do użytkownika.
    - Nie jest sprawdzana czy notyfikacja została przetworzona na serwerze.

12. **Zasady komunikacji**:
    - W metodzie `notify`, nie jest sprawdzana czy notyfikacja została wysłana poprawnie do użytkownika.
    - Nie jest sprawdzana czy notyfikacja została przetworzona na serwerze.

13. **Zasady zabezpieczenia**:
    - W metodzie `notify`, nie jest sprawdzana czy