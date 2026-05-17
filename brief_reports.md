### Podsumowanie

Ten kod implementuje funkcje dla administracji w aplikacji FastAPI. W szczególności:

1. **Pit Uke Report Page**:
   - Zwraca stronę HTML z raportem PIT UKE.
   - Wykorzystuje SQLAlchemy do pobierania danych z bazy danych i renderowania strony.

2. **Pit Export CSV**:
   - Generuje plik CSV z danymi zapytania PIT UKE.
   - Używa SQLAlchemy do wykonywania zapytania i serializacji wyników do CSV.

3. **Network Map Page**:
   - Zwraca stronę HTML z mapą sieci.
   - Wykorzystuje SQLAlchemy do pobierania danych z bazy danych i renderowania strony.

### Funkcje i Zależności

- **get_db**: Wskaźnik do bazy danych.
- **require_admin**: Middleware, sprawdzający czy użytkownik jest administratorem.
- **render**: Renderowanie strony HTML.
- **models**: Modely bazy danych.
- **io**: Plików wejściowych i wyjściowych.
- **csv**: Moduł do generowania CSV.

### Struktura Kode

1. **API Router**:
   - `/admin/pit`: Zwraca stronę HTML z raportem PIT UKE.
   - `/admin/pit/export`: Generuje plik CSV z danymi zapytania PIT UKE.
   - `/admin/passport/map`: Zwraca stronę HTML z mapą sieci.

2. **Renderowanie Strony**:
   - `render(request, "admin/pit_uke.html", { ... })` - Renderowanie strony HTML.
   - `json.dumps(nodes_data)` - Konwersja listy obiektów do JSON.

3. **Pobieranie Danych z Bazy danych**:
   - `select(models.CustomerDevice).options(joinedload(models.Customer.device))` - Wykrywanie połączenia między tabelami.
   - `db.scalars(stmt).all()` - Pobranie wszystkich obiektów.

4. **Serializacja Do CSV**:
   - `csv.writer(output, delimiter=';')` - Tworzenie writera do CSV.
   - `writer.writerow(['ID', 'IP', 'MAC', 'Customer', 'Street', 'Number'])` - Wpisanie nagłówków.
   - `writer.writerow([n.id, n.ip_address or "", n.mac_address or "", cust_name, street_name, street_num])` - Wpisanie danych.

5. **Pobieranie Danych z Bazy danych**:
   - `select(models.NetNode).options(joinedload(models.NetNode.location_city))` - Wykrywanie połączenia między tabelami.
   - `db.scalars(stmt).all()` - Pobranie wszystkich obiektów.

6. **Konwersja Listy do JSON**:
   - `json.dumps(nodes_data)` - Konwersja listy obiektów do JSON.

### Zależności

- SQLAlchemy
- FastAPI
- Jinja2 (zawiera render)
- io
- csv