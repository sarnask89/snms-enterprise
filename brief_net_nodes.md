### Podsumowanie Użytych Funkcji i Zależności

#### 1. Importy i Definicje Modeli
- `from fastapi import APIRouter, Depends, Form, Request`
- `from fastapi.responses import HTMLResponse, RedirectResponse`
- `from sqlalchemy import select, or_`
- `from sqlalchemy.orm import Session, joinedload`

- `from app import models`
- `from app.database import get_db`
- `from app.deps import require_business_write, verify_session`
- `from app.templating import render`
- `from app.audit import record_audit`
- `from app.logger_utils import get_logger`

#### 2. Definicje Routeów
- `/net-nodes`: Lista węzłów
- `/net-nodes/topology`: Mapa topologii sieci
- `/net-nodes/new`: Formularz dodawania nowego węzła
- `/net-nodes/{node_id}/edit`: Formularz edycji istniejącego węzła
- `/net-nodes/{node_id}/links/add`: Dodanie połączenia do istniejącego węzła
- `/net-nodes/{node_id}/edit`: Edycja istniejącego węzła
- `/net-nodes/{node_id}/delete`: Usuwanie istniejącego węzła

#### 3. Definicje Funkcji Pomocniczych
- `_get_managed_cities(db: Session)`: Zwraca listę zarządzanych miast
- `_opt_int(raw: str | None) -> int | None`: Konwertuje wartość do liczby, jeśli jest poprawna

#### 4. Definicje Handlerów Pliku HTML
- `net_nodes_list(request: Request, search_q: str = "", db: Session = Depends(get_db))`
- `network_topology_map(request: Request, db: Session = Depends(get_db))`
- `net_node_new_form(request: Request, db: Session = Depends(get_db))`
- `net_node_add_link(node_id: int, request: Request, target_node_id: int = Form(...), medium_type: str = Form("Fiber"), capacity: int | None = Form(None), db: Session = Depends(get_db))`
- `net_node_edit_form(node_id: int, request: Request, db: Session = Depends(get_db))`
- `net_node_edit_submit(node_id: int, request: Request, db: Session = Depends(get_db), name: str = Form(...), division_id: str | None = Form(None), location_city_id: str | None = Form(None), location_street_id: str | None = Form(None), street_number: str | None = Form(None), latitude: str | None = Form(None), longitude: str | None = Form(None), node_type: str | None = Form(None), owner_type: str | None = Form(None), sidusis_id: str | None = Form(None), has_power: str | None = Form(None), has_env_control: str | None = Form(None), uke_node_kind: str | None = Form(None), uke_access_rules: str | None = Form(None))`
- `net_node_delete(node_id: int, request: Request, db: Session = Depends(get_db))`

#### 5. Definicje Logowania i Audytu
- `record_audit(db, "create", "net_node", n.id, f"Node: {n.name}", request)`
- `record_audit(db, "update", "net_node", n.id, f"Node: {n.name}", request)`

#### 6. Definicje Loggerów
- `logger = get_logger("net_nodes")`

### Zależności

- `get_db`: Funkcja do pobierania sesji bazy danych
- `require_business_write`: Funkcja sprawdzająca czy użytkownik ma prawa do zapisu
- `verify_session`: Funkcja sprawdzająca czy jest zalogowany użytkownik
- `render`: Funkcja do renderowania szablonów HTML

### Używanie Zależności

- `get_db` jest używana w definicjach routeów, aby pobierać sesję bazy danych.
- `require_business_write` sprawdza czy użytkownik ma prawa do zapisu, co jest wymagane dla niektórych operacji.
- `verify_session` sprawdza czy jest zalogowany użytkownik, co jest wymagane w niektórych operacjach.

### Logowanie i Audyt

- `record_audit` jest używana do zapisywania logów zdarzeń bazy danych.
- `logger` jest używany do generowania logów w celu monitorowania działania aplikacji.