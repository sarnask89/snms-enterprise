### Podsumowanie

Ten kod implementuje funkcjonalność serwisu w aplikacji FastAPI. Wszystkie operacje, takie jak lista, dodawanie, edycja i usuwanie usługi Visual, są realizowane przez odpowiednie endpointy API.

#### Endpointy API:

1. **Lista Usługi Visual:**
   - `/ext-services-visual`
   - Zwraca listę wszystkich usługi Visual wraz z opcjonalnym filtracją po nazwie lub opisie.
   - Używa SQLAlchemy do wykonywania zapytania SQL i renderowania wyników w HTML.

2. **Formularz Dodawania Usługi Visual:**
   - `/ext-services-visual/new`
   - Pobiera dane od użytkownika (nazwa usługi, koszt, opis) za pomocą formularza.
   - Używa SQLAlchemy do dodania nowej usługi Visual do bazy danych.

3. **Formularz Edycji Usługi Visual:**
   - `/ext-services-visual/{item_id}/edit`
   - Pobiera dane od użytkownika (nazwa usługi, koszt, opis) za pomocą formularza.
   - Używa SQLAlchemy do aktualizacji danych existentnej usługi Visual w bazy danych.

4. **Formularz Usuwania Usługi Visual:**
   - `/ext-services-visual/{item_id}/delete`
   - Pobiera identyfikator usługi Visual za pomocą URL.
   - Używa SQLAlchemy do usuwania usługi Visual z bazy danych.

#### Funkcje i Zależności:

1. **get_db:** Funkcja dostarcza połączenie z bazą danych, które jest używane przez wszystkie endpointy API.
2. **verify_session:** Funkcja sprawdza czy użytkownik ma poprawne sesję, aby dostać dostęp do endpointów.
3. **render:** Funkcja renderuje szablony HTML w aplikacji FastAPI.
4. **models:** Model bazy danych, który definiuje strukturę tabeli usługi Visual.

### Struktura Katalogu:

```
app/
├── database.py
├── deps.py
├── ext_services_visual.py
├── models.py
└── templates/
    └── generated/
        ├── ext_services_visual_form.html
        └── ext_services_visual_list.html
```

### Używanie:

1. **Zainstaluj zależności:**
   ```bash
   pip install fastapi uvicorn sqlalchemy
   ```

2. **Uruchom aplikację:**
   ```bash
   uvicorn app.main:app --reload
   ```

3. **Otwórz przeglądarkę i przejdź do `http://127.0.0.1:8000/ext-services-visual`**.

### Zasoby:

- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [Uvicorn](https://uvicorn.readthedocs.io/en/latest/)