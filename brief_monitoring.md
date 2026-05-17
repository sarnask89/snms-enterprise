### Podsumowanie Użytych Funkcji i Zależności

#### 1. **API Endpoints**
   - `/admin/monitoring`: Pobiera podstawowe statystyki, w tym listę urządzeń, liczby online i offline, oraz ostatnie powiadomienia.
   - `/admin/monitoring/device/{device_id}`: Pobiera szczegółowe informacje o urządzeniu, w tym statystyki i monitorowane elementy.
   - `/api/device/{device_id}/stats`: Zwraca statystykę dla określonego urządzenia w formacie JSON.
   - `/api/device/{device_id}/netflow`: Zwraca netflow danych dla określonego urządzenia w formacie JSON.
   - `/gpu`: Pobiera informacje o GPU, w tym ostatnie statystyki.
   - `/api/customer-device/{device_id}/stats`: Zwraca statystykę dla określonego klienta w formacie JSON.
   - `/api/global/stats`: Zwraca globalną statystykę w formacie JSON.

#### 2. **Zależności**
   - `fastapi`: Wskaźnik do tworzenia aplikacji webowej.
   - `sqlalchemy`: Kwantyfikator do tworzenia bazy danych i modeli obiektów.
   - `datetime`: Moduł do manipulowania datami i czasem.
   - `json`: Moduł do serializacji i deserializacji JSON.
   - `logging`: Moduł do logowania informacji.
   - `collections`: Moduł do tworzenia kontenerów, takich jak `Counter`.
   - `app.models.monitoring`: Modely obiektów dla bazy danych.
   - `app.database`: Kwantyfikator do tworzenia połączenia z bazą danych.
   - `app.deps`: Dekoratory i funkcje do sprawdzania sesji.
   - `app.templating`: Moduł do renderowania HTML.

#### 3. **Struktura Kodu**
   - **Models**: Definiują struktury obiektów bazy danych, takich jak `NetDevice`, `SystemNotification`, `NetworkStat`, `MonitorItem`, `NvidiaGPU`, `CustomerDevice`.
   - **Database Operations**: Kwantyfikator do wykonywania zapytań SQL.
   - **Dependency Injection**: Używa dekoratorów i funkcji do sprawdzania sesji.
   - **Template Rendering**: Wskaźnik do renderowania HTML za pomocą `jinja2`.
   - **Logging**: Kwantyfikator do logowania informacji.

### 4. **Zależności w Code**

- **`get_db`**: Zwraca połączenie z bazą danych.
- **`verify_session`**: Sprawdza, czy użytkownik jest zalogowany.
- **`render`**: Renderuje HTML za pomocą `jinja2`.
- **`models`**: Definiuje struktury obiektów bazy danych.
- **`database`**: Kwantyfikator do tworzenia połączenia z bazą danych.
- **`deps`**: Dekoratory i funkcje do sprawdzania sesji.
- **`templating`**: Moduł do renderowania HTML za pomocą `jinja2`.
- **`logging`**: Kwantyfikator do logowania informacji.

### 5. **Zależności w Code**

- **`get_db`**: Zwraca połączenie z bazą danych.
- **`verify_session`**: Sprawdza, czy użytkownik jest zalogowany.
- **`render`**: Renderuje HTML za pomocą `jinja2`.
- **`models`**: Definiuje struktury obiektów bazy danych.
- **`database`**: Kwantyfikator do tworzenia połączenia z bazą danych.
- **`deps`**: Dekoratory i funkcje do sprawdzania sesji.
- **`templating`**: Moduł do renderowania HTML za pomocą `jinja2`.
- **`logging`**: Kwantyfikator do logowania informacji.