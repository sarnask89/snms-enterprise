### Podsumowanie

Ten kod generuje pliki i struktury danych dla aplikacji webowej, korzystającej z FastAPI. W szczególności:

1. **Generowanie pliku `app/generated/[[ module_name_snake ]].py`**:
   - Używane funkcje: `select`, `or_`, `Session`, `models`
   - Zależności: `fastapi`, `sqlalchemy`, `app.database`, `app.templating`, `app.deps`, `app`

2. **Generowanie pliku `templates/generated/[[ module_name_snake ]].html`**:
   - Używane funkcje: `render`
   - Zależności: `fastapi.responses`

3. **Generowanie pliku `templates/generated/[[ module_name_snake ]]_form.html`**:
   - Używane funkcje: `Form`, `textarea`, `input`
   - Zależności: `fastapi`

### Struktura generowanych plików

- **app/generated/[[ module_name_snake ]].py**: Klasa FastAPI router, zdefiniowana w zależności od nazwy modułu.
- **templates/generated/[[ module_name_snake ]].html**: Szablon HTML listy elementów.
- **templates/generated/[[ module_name_snake ]]_form.html**: Szablon HTML formularza do edycji elementów.

### Generowanie kodu

1. **Generowanie routera**:
   - Używane funkcje: `select`, `or_`, `Session`, `models`
   - Zależności: `fastapi`, `sqlalchemy`, `app.database`, `app.templating`, `app.deps`, `app`

2. **Generowanie listy**:
   - Używane funkcje: `render`
   - Zależności: `fastapi.responses`

3. **Generowanie formularza**:
   - Używane funkcje: `Form`, `textarea`, `input`
   - Zależności: `fastapi`

### Funkcje generowane

- **[[ module_name_snake ]]**: Klasa FastAPI router.
- **[[ module_name_snake ]].list**: Metoda do listy elementów.
- **[[ module_name_snake ]].new**: Metoda do tworzenia nowego elementu.
- **[[ module_name_snake ]].edit**: Metoda do edycji elementu.
- **[[ module_name_snake ]].delete**: Metoda do usuwania elementu.

### Zależności

- `fastapi`
- `sqlalchemy`
- `app.database`
- `app.templating`
- `app.deps`
- `app`

### Używanie

1. **Zainstalowanie pakietów**:
   ```bash
   pip install fastapi sqlalchemy app.database app.templating app.deps app
   ```

2. **Kompilacja kodu**:
   - Zapisz kod w plikach `app/generated/[[ module_name_snake ]].py`, `templates/generated/[[ module_name_snake ]].html`, i `templates/generated/[[ module_name_snake ]]_form.html`.
   - Utwórz plik `app/main.py` z kodem generowanym.

3. **Uruchomienie aplikacji**:
   ```bash
   uvicorn app.main:app --reload
   ```

### Przykład

```python
# app/generated/[[ module_name_snake ]].py
from fastapi import APIRouter, Depends, Request, Form, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app.database import get_db
from app.templating import render
from app.deps import verify_session
from app import models

router = APIRouter(prefix="/[[ module_name_url ]]", dependencies=[Depends(verify_session)])

@router.get("", response_class=HTMLResponse)
def [[ module_name_snake ]]_list(
    request: Request, 
    db: Session = Depends(get_db),
    q: str | None = Query(None)
):
    stmt = select(models.[[ class_name ]])
    if q:
        # Simple search across string fields
        term = f"%{q}%"
        stmt = stmt.where(or_(
            models.[[ class_name ]].name.like(term),
            models.[[ class_name ]].description.like(term)
        ))
    return render(request, "[[ module_name_snake ]].html", items=stmt.all())

@router.get("/new")
def [[ module_name_snake ]]_new(request: Request):
    return render(request, "[[ module_name_snake ]]_