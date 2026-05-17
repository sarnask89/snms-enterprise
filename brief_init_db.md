### Podsumowanie

Ten kod jest skryptem Pythona, który inicjalizuje bazę danych dla aplikacji CRM. W tym skrypcie, używane są różne funkcje i klasy z pakietów SQLAlchemy, Alembic, oraz inne biblioteki do obsługi bazy danych i konfiguracji.

#### Funkcje:

1. **seed()**: Tworzy domyślnego administratora, jeśli baza jest pusta (D4).
2. **ensure_default_catalog_seed()**: Zapewnia podstawowe wpisy w słownikach technicznych.
3. **ensure_plan_extensions()**: Placeholder dla przyszłych rozszerzeń (np. moduły PIT/UKE).
4. **ensure_portal_rbac()**: Inicjalizuje uprawnienia menu dla ról (D5).
5. **ensure_helpdesk_seed()**: Tworzy domyślne kolejki i kategorie helpdesku.
6. **ensure_app_settings()**: Inicjalizuje kluczowe ustawienia systemowe.
7. **ensure_message_templates_seed()**: Tworzy domyślne szablony wiadomości.
8. **run_migrations()**: Uruchamia migracje Alembic programowo (D6).
9. **init_all()**: Inicjalizuje bazę danych, włącza migracje, tworzy administratora, zapewnia podstawowe wpisy, inicjalizuje uprawnienia menu, tworzy helpdesk, inicjalizuje ustawienia systemowe, tworzy szablony wiadomości, i weryfikuje lokalne tabele TERYT.
10. **validate_local_teryt_data()**: Weryfikuje czy lokalne tabele TERYT mają jakiekolwiek dane.

#### Zależności:

- SQLAlchemy
- Alembic
- Python Standard Library (logging, os, pathlib)
- app.models
- app.config
- app.database
- app.security
- app.nav_access
- app.config_validation

### Struktura kodu:

1. **init_db.py**: Plik z funkcjami inicjalizacji bazy danych.
2. **alembic.ini**: Konfiguracja Alembic.
3. **models.py**: Definicje modeli bazy danych.
4. **config.py**: Konfiguracja aplikacji.
5. **database.py**: Klasa SQLAlchemy, która zarządza połączeniem z bazą danych.
6. **security.py**: Funkcja do hashowania hasła.
7. **nav_access.py**: Funkcje do inicjalizacji uprawnienia menu.
8. **config_validation.py**: Funkcja do weryfikacji konfiguracji systemu.

### Używanie:

1. Zainstaluj wymagane biblioteki:
   ```bash
   pip install sqlalchemy alembic python-dotenv
   ```

2. Utwórz plik `.env` z następującymi parametrami:
   ```
   CRM_ADMIN_USER=admin
   CRM_ADMIN_PASSWORD=your_password
   UPLOAD_ROOT=/path/to/upload/directory
   ```

3. Uruchom skrypt:
   ```bash
   python init_db.py
   ```

4. W przypadku testowania, można użyć flagi `TESTING` w środowisku:
   ```bash
   export TESTING=1
   python init_db.py
   ```

5. W przypadku braku danych TERYT, należy uruchomić skrypt `teryt_sync.py` z odpowiednimi argumentami.

### Wersja:

- Python 3.8+
- SQLAlchemy 2.x
- Alembic 1.x

### Przykładowy output:

```
INFO:app.init_db:Seeding default admin user: admin
INFO:app.init_db:Local TERYT data: OK (5 states, 10 cities)
```

Ten skrypt inicjalizuje bazę danych, tworzy administratora, zapewnia podstawowe wpisy, inicjalizuje uprawnienia menu, tworzy helpdesk, inicjalizuje ustawienia systemowe, tworzy szablony wiadomości, i weryfikuje lokalne tabele TERYT.