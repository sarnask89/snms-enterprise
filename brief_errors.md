### Podsumowanie

Ten kod implementuje funkcje obsługujące różne typy błędów w aplikacji FastAPI. Wszystkie funkcje są zaimplementowane jako asynchroniczne (async) i korzystają z bibliotek `logging` do logowania błędów, `fastapi` do obsługi żądań HTTP, `sqlalchemy.exc` dla obsługiwania bazy danych, oraz `app.templating` do renderowania szablonów HTML.

#### Funkcje:

1. **global_exception_handler**:
   - Zapisuje informacje o błędzie do loggera.
   - Sprawdza, czy żądanie jest HTMX (zapytanie AJAX).
   - Jeśli jest HTMX, renderuje fragment błędu HTMX.
   - W przeciwnym razie renderuje szablon `errors/500.html` lub `errors/error.html`, w zależności od statusu błędu.

2. **sqlalchemy_exception_handler**:
   - Zapisuje informacje o błędzie do loggera.
   - Sprawdza, czy żądanie jest HTMX.
   - Jeśli jest HTMX, renderuje fragment błędu HTMX.
   - W przeciwnym razie renderuje szablon `errors/error.html`, w zależności od statusu błędu.

3. **http_exception_handler**:
   - Sprawdza, czy status błędu jest 3xx (przekierowanie).
   - Jeśli tak, zwraca odpowiedni response HTMX.
   - W przeciwnym razie renderuje szablon `errors/404.html` lub `errors/error.html`, w zależności od statusu błędu.

4. **_is_htmx**:
   - Sprawdza, czy żądanie jest HTMX.

5. **_render_htmx_error**:
   - Renderuje fragment błędu HTMX.

6. **setup_error_handlers**:
   - Registra wszystkie funkcje obsługujące różne typy błędów do aplikacji FastAPI.

### Zależności:

- `logging`
- `fastapi`
- `sqlalchemy.exc`
- `app.templating`

### Używanie:

1. **global_exception_handler**: Wykrywa i loguje błędy, następnie renderuje odpowiedni szablon HTML.
2. **sqlalchemy_exception_handler**: Wykrywa błędy bazy danych, następnie renderuje odpowiedni szablon HTML.
3. **http_exception_handler**: Wykrywa HTTP- błędы, następnie renderuje odpowiedni szablon HTML.
4. **_is_htmx**: Sprawdza, czy żądanie jest HTMX.
5. **_render_htmx_error**: Renderuje fragment błędu HTMX.
6. **setup_error_handlers**: Registra wszystkie funkcje obsługujące różne typy błędów do aplikacji FastAPI.

### Przykład użycia:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    raise HTTPException(status_code=500, detail="Błąd bazy danych")

setup_error_handlers(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

W tym przykładzie, gdy użytkownik otworzy stronę główną (`/`), zostanie wygenerowany błąd 500 z szablonem `errors/error.html`.