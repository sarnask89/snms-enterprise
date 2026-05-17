### Podsumowanie Użytych Funkcji i Zależności

#### Funkcje:
1. **client_dashboard**: Wyświetla dashboard klienta z ostatnimi płatnicami, usługami i zgłoszeniami serwisowe.
2. **client_payments**: Wyświetla listę ostatnich płatnic klienta.
3. **client_subscriptions**: Wyświetla listę aktywnych usług klienta.
4. **client_helpdesk**: Wyświetla listę zgłoszeń serwisowych klienta.
5. **client_devices**: Wyświetla listę urządzeń klienta i mockuje statusy.
6. **client_shop**: Wyświetla listę tarifów aktywnych.
7. **client_profile**: Wyświetla profil klienta.
8. **client_profile_update**: Aktualizuje profil klienta.

#### Zależności:
1. **APIRouter**: Do tworzenia routingu API.
2. **Depends(require_client)**: Weryfikacja czy jest zalogowany klient.
3. **Request**: Obiekt żądania HTTP.
4. **Form**: Formularz zapytania.
5. **Session**: Sesja bazy danych.
6. **models**: Modely bazy danych.
7. **get_db**: Funkcja do pobierania sesji bazy danych.
8. **require_client**: Funkcja do sprawdzania czy jest zalogowany klient.
9. **render**: Funkcja do renderowania szablonów HTML.
10. **asyncio**: Wątkowość asynchroniczna.

### Struktura Kode

- **client_dashboard**: Wyświetla dashboard klienta z ostatnimi płatnicami, usługami i zgłoszeniami serwisowe.
- **client_payments**: Wyświetla listę ostatnich płatnic klienta.
- **client_subscriptions**: Wyświetla listę aktywnych usług klienta.
- **client_helpdesk**: Wyświetla listę zgłoszeń serwisowych klienta.
- **client_devices**: Wyświetla listę urządzeń klienta i mockuje statusy.
- **client_shop**: Wyświetla listę tarifów aktywnych.
- **client_profile**: Wyświetla profil klienta.
- **client_profile_update**: Aktualizuje profil klienta.

### Przykład Użycia

1. **Wywołanie Dashboardu**:
   ```http
   GET /client/dashboard
   ```

2. **Wywołanie Płatności**:
   ```http
   GET /client/payments
   ```

3. **Wywołanie Usług**:
   ```http
   GET /client/subscriptions
   ```

4. **Wywołanie Zgłoszeń Serwisowych**:
   ```http
   GET /client/helpdesk
   ```

5. **Wywołanie Urządzeń**:
   ```http
   GET /client/devices
   ```

6. **Wywołanie Oferty i Sklep**:
   ```http
   GET /client/shop
   ```

7. **Wywołanie Profilu**:
   ```http
   GET /client/profile
   ```

8. **Aktualizacja Profilu**:
   ```http
   POST /client/profile
   ```

### Zależności

- **FastAPI**: Do tworzenia API.
- **SQLAlchemy**: Do bazy danych.
- **Jinja2**: Do renderowania szablonów HTML.

### Przykład Renderowania Szablonu

```html
<!-- client/dashboard.html -->
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>{{ title }}</title>
</head>
<body>
    <h1>{{ title }}</h1>
    <ul>
        {% for invoice in invoices %}
            <li>{{ invoice.issue_date }} - {{ invoice.amount }}</li>
        {% endfor %}
    </ul>
</body>
</html>
```

### Przykład Aktualizacji Profilu

```python
# client/profile_update
async def client_profile_update(
    request: Request,
    db: Session = Depends(get_db),
    email: str | None = Form(None),
    phone: str | None = Form(None),
):
    client = request.state.client_user
    c = db.get(models.Customer, client.id)
    if c:
        if email: c.email = email.strip()
        if phone: c.phone = phone.strip()
        db.commit()
    return RedirectResponse("/client/profile?success=1", status_code