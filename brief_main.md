### Przeanalizowanie kodu

#### Funkcje i zależności

1. **contextlib.asynccontextmanager**: Używane do definiowania kontekstu, który może być używany w funkcjach asynchronicznych.
2. **fastapi**: Wskaźnik do biblioteki FastAPI, która jest używana do tworzenia aplikacji webowych.
3. **fastapi.staticfiles**: Używane do dodawania statycznych plików (np. CSS, JavaScript) do aplikacji.
4. **starlette.middleware.sessions**: Używane do zarządzania sesjami w aplikacji FastAPI.
5. **sqlalchemy**: Wskaźnik do biblioteki SQLAlchemy, która jest używana do tworzenia bazy danych i interakcji z nią.
6. **sqladmin**: Używane do automatycznego generowania widoków administracyjnych dla bazy danych SQL.
7. **app.settings**: Wskaźnik do konfiguracji aplikacji, zawierających ustawienia takie jak nazwa aplikacji i klucz klucza sesji.
8. **app.router_aggregator**: Używane do tworzenia ruterów dla aplikacji.
9. **app.init_db**: Używane do inicjalizacji bazy danych i uruchomienia migracji Alembic.
10. **app.database**: Wskaźnik do funkcji, która zwraca sesję bazy danych.
11. **app.admin_auth**: Używane do definiowania autentykacji dla widoków administracyjnych.
12. **app.admin_views**: Używane do dodawania widoków administracyjnych do SQLAdmin.
13. **app.config**: Wskaźnik do konfiguracji aplikacji, zawierających ustawienia takie jak katalog główny.
14. **app.middleware_portal**: Używane do dodawania middleware do aplikacji, które obsługują autentykację portalowej.
15. **app.middleware_logging**: Używane do dodawania middleware do aplikacji, które obsługują logowanie.
16. **app.errors**: Używane do definiowania funkcji, która ustawia obsługę błędów w aplikacji.
17. **app.deps**: Uzywane do definiowania dekoratorów, które są używane do sprawdzania autentykacji dla widoków administracyjnych.
18. **app.logger_utils**: Używane do definiowania funkcji, która ustawia obsługę logów w aplikacji.
19. **app.services.sync_service**: Używane do tworzenia serwisu synchronicznego.
20. **app.services.netflow_service**: Uzywane do tworzenia serwisu netflow.
21. **setup_logging**: Funkcja, która ustawia obsługę logów w aplikacji.
22. **service_registry.register**: Funkcja, która dodaje serwisy do rejestru.
23. **lifespan**: Funkcja, która inicjalizuje i zatrzymuje bazy danych i migracje Alembic.
24. **app**: Wskaźnik do aplikacji FastAPI.
25. **setup_error_handlers**: Funkcja, która ustawia obsługę błędów w aplikacji.
26. **app.add_middleware**: Funkcja, która dodaje middleware do aplikacji.
27. **PortalUserMiddleware**: Middleware, który obsługuje autentykację portalowej.
28. **SessionMiddleware**: Middleware, który zarządzanie sesjami w aplikacji FastAPI.
29. **get_core_router**: Funkcja, która tworzy ruter dla aplikacji.
30. **health_check**: Funkcja, która sprawdza dostępność bazy danych.
31. **run_system_migrations**: Funkcja, która zleca uruchomienie migracji Alembic w tle.

#### Struktura kodu

1. **setup_logging**: Ustawia obsługę logów w aplikacji.
2. **service_registry.register**: Dodaje serwisy do rejestru.
3. **lifespan**: Funkcja, która inicjalizuje i zatrzymuje bazy danych i migracje Alembic.
4. **app**: Wskaźnik do aplikacji FastAPI.
5. **setup_error_handlers**: Funkcja, która ustawia obsługę błędów w aplikacji.
6. **app.add_middleware**: Funkcja, która