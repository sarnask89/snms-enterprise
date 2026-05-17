### Podsumowanie

Ten kod implementuje funkcje dla zarządzania PUSZ (Przewodnik Uprawniony Środowiska) w aplikacji. W szczególności:

1. **Exportacja PUSZ**:
   - `export_pit_nodes` generuje i zwraca plik GML zawierający współrzędne NetNodes, które mają współrzędne PUWG 1992.
   - Używa funkcji `generate_pit_gml` do tworzenia GML-a.

2. **Synchronizacja PUSZ**:
   - `trigger_pit_sync` uruchamia zadanie w tle, które pobiera współrzędne NetNodes bez PUWG 1992 i zapisuje je na bieżącego połączeniu.
   - Używa funkcji `GugikGeocodingService` do pobierania współrzędnych.

3. **Zadanie w tle**:
   - `sync_pit_coordinates_task` jest asynchronicznym zadaniem, które wykonywane są w tle po uruchomieniu `/admin/pit/sync`.
   - W tym zadaniu pobiera współrzędne NetNodes bez PUWG 1992 i zapisuje je na bieżącego połączeniu.

### Zależności

- `fastapi`: Biblioteka do tworzenia aplikacji webowych.
- `sqlalchemy`: Biblioteka do interakcji z bazą danych SQL.
- `app.models`, `app.database`, `app.deps`, `app.services.pit_exporter`, `app.services.gugik`, `app.logger_utils`: Moduły i funkcje z aplikacji, które są używane w kodzie.

### Funkcje

1. **export_pit_nodes**:
   - Zapytanie do bazy danych SQL, które wybiera NetNodes bez PUWG 1992.
   - Generowanie GML-a za pomocą `generate_pit_gml`.
   - Wysłanie GML-a jako odpowiedź z nagłówkiem i paskiem.

2. **trigger_pit_sync**:
   - Utworzenie zadania w tle, które wykonywane są w tle po uruchomieniu `/admin/pit/sync`.
   - Pobranie współrzędnych NetNodes bez PUWG 1992 i zapisanie je na bieżącego połączeniu.

3. **sync_pit_coordinates_task**:
   - Asynchroniczne zadanie, które pobiera współrzędne NetNodes bez PUWG 1992 i zapisuje je na bieżącego połączeniu.
   - Wykrywanie braku współrzędnych za pomocą `GugikGeocodingService`.
   - Aktualizacja współrzędnych w bazie danych SQL.

### Logowanie

- Używane logowanie z biblioteki `app.logger_utils`.

### Przykład użycia

1. **Export PUSZ**:
   ```http
   GET /admin/pit/export/nodes
   ```

2. **Synchronizacja PUSZ**:
   ```http
   POST /admin/pit/sync
   ```

3. **Pobranie logów auditów**:
   ```http
   GET /admin/audit-logs?msg=PIT+Sync+Started
   ```

### Zasoby

- `app.models`: Modely bazy danych.
- `app.database`: Klasa połączenia z bazą danych.
- `app.deps`: Funkcje dekoratorowe, które sprawdzają sesję i uprawnienia.
- `app.services.pit_exporter`: Wskaźnik do funkcji generującej GML.
- `app.services.gugik`: Wskaźnik do funkcji geocodowania z GUGiK.

### Przykładowy kod

```python
# app/models.py
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class NetNode(Base):
    __tablename__ = 'net_nodes'
    
    id = Column(Integer, primary_key=True)
    x_1992 = Column(Float)
    y_1992 = Column(Float)
    location_city_id = Column(String)
    location_street_id = Column(String)
    street_number = Column(String)

# app/database.py
from sqlalchemy import create_engine, SessionLocal
from app.models import Base

engine = create_engine('sqlite:///example.db')
Base.metadata.create_all(engine)

def get_db():
   