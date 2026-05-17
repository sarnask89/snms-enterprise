### Podsumowanie

Ten kod jest aplikacją FastAPI, która zarządza konfiguracją NMS (Network Management System). W tym skrypcie zdefiniowano następujące funkcje i zależności:

1. **`config_index`**:
   - Zwraca stronę główną z listą szablonów monitorowania.
   - Używa SQLAlchemy do pobrania wszystkich szablonów z bazy danych.

2. **`template_new`**:
   - Zwraca formularz do dodania nowego szablonu monitorowania.
   - Używa SQLAlchemy do dodawania nowego szablonu do bazy danych.

3. **`template_new_submit`**:
   - Przetwarza formularz dodawania nowego szablonu.
   - Używa SQLAlchemy do dodawania nowego szablonu do bazy danych i przekierowuje na stronę główną.

4. **`device_discovery_view`**:
   - Zwraca stronę z listą interfejsów urządzenia.
   - Używa SQLAlchemy do pobrania interfejsów z bazy danych.
   - Przy użyciu native Mikrotik API, sprawdza stan i prędkość interfejsów. Jeśli nie jest dostępna native API, używa simulacji SNMP.

5. **`discovery_add_items`**:
   - Zwraca formularz do dodania elementów monitorowania.
   - Używa SQLAlchemy do dodawania elementów monitorowania do bazy danych.

6. **`discover_items`**:
   - Przetwarza formularz dodawania elementów monitorowania.
   - Używa SQLAlchemy do dodawania elementów monitorowania do bazy danych i przekierowuje na stronę główną.

7. **`template_items`**:
   - Zwraca stronę z listą elementów szablonu monitorowania.
   - Używa SQLAlchemy do pobrania elementów szablonu z bazy danych.

### Zależności

- `fastapi`: Wskaźnik do frameworka FastAPI.
- `sqlalchemy`: Wskaźnik do ORM SQLAlchemy.
- `app.database`: Moduł, który zawiera funkcje do pobierania bazy danych.
- `app.deps`: Moduł, który zawiera funkcje do sprawdzania sesji.
- `app.templating`: Moduł, który zawiera funkcję renderowania szablonów HTML.
- `app.models`: Modeli bazy danych.
- `app.services.snmp_service`: Moduł, który zawiera funkcję SNMP discovery.
- `app.security_utils`: Moduł, który zawiera funkcję dekrypcji hasła.

### Logowanie

- Używane jest logowanie do aplikacji za pomocą modułu `logging`.

### Przykład wykorzystania

1. **Pobranie szablonów**:
   ```python
   from fastapi import Depends, Request
   from app.database import get_db
   from app.deps import verify_session
   from app.templating import render

   @router.get("", response_class=HTMLResponse)
   def config_index(request: Request, db: Session = Depends(get_db)):
       templates = db.scalars(select(models.MonitorTemplate)).all()
       return render(request, "admin/monitor_config.html", {
           "title": "Konfiguracja NMS",
           "templates": templates
       })
   ```

2. **Dodanie nowego szablonu**:
   ```python
   from fastapi import Depends, Request, Form
   from app.database import get_db
   from app.deps import verify_session

   @router.post("/template/new")
   def template_new_submit(name: str = Form(...), description: str = Form(None), db: Session = Depends(get_db)):
       tmpl = models.MonitorTemplate(name=name, description=description)
       db.add(tmpl)
       db.commit()
       return RedirectResponse("/admin/monitor-config", status_code=303)
   ```

3. **Pobranie interfejsów urządzenia**:
   ```python
   from fastapi import Depends, Request
   from app.database import get_db

   @router.get("/discovery/{device_id}", response_class=HTMLResponse)
   async def device_discovery_view(device_id: int, request: Request, db: Session = Depends(get_db)):
       # Implement logic to fetch interfaces and simulate SNMP discovery if native API is not available
       pass
   ```

4. **Dodawanie elementów monitorowania**:
   ```python
   from fastapi import Depends, Request

   @router.post("/discovery/{device_id}/add