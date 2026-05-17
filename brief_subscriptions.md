### Podsumowanie

Ten kod implementuje funkcjonalność zarządzania subskrypcjami w aplikacji. Wszystkie operacje to wykonywane na bazie bazy danych SQLAlchemy, która jest dostarczana przez `get_db` zgodnie z zależnością.

#### Funkcje i Zależności

1. **Subscription List**:
   - **Funkcja**: `subscription_list`
   - **Zależność**: `verify_session`
   - **Opis**: Pobiera listę subskrypcji, włącznie z informacjami o kliencie i tariffach. Używa renderowania HTML do wyświetlenia listy.

2. **Subscription New Form**:
   - **Funkcja**: `subscription_new_form`
   - **Zależności**: `verify_session`, `customer_id`, `device_id`
   - **Opis**: Pobiera listę klientów i tarifów, a następnie renderuje formularz do dodania nowej subskrypcji. Jeśli klienci są zaznaczone, pre-populują drzewo urządzeń.

3. **Get Customer Nodes**:
   - **Funkcja**: `get_customer_nodes`
   - **Zależności**: `verify_session`, `customer_id`
   - **Opis**: Pobiera listę urządzeń dla określonego klienta i renderuje opcje drzewa.

4. **Subscription New Submit**:
   - **Funkcja**: `subscription_new_submit`
   - **Zależności**: `verify_session`, `require_business_write`
   - **Opis**: Tworzy nową subskrypcję w bazie danych, ustawia datę rozpoczęcia i zakończenia, a następnie przekierowuje do listy subskrypcji.

5. **Subscription Toggle**:
   - **Funkcja**: `subscription_toggle`
   - **Zależności**: `verify_session`, `require_business_write`
   - **Opis**: Zmienia stan subskrypcji (włączona lub wyłączona) w bazie danych i przekierowuje do listy subskrypcji.

6. **Subscription Delete**:
   - **Funkcja**: `subscription_delete`
   - **Zależności**: `verify_session`, `require_business_write`
   - **Opis**: Usuwa subskrypcję z bazie danych i przekierowuje do listy subskrypcji.

### Używanie

1. **Subskrypcje Listowe**:
   - Zostaje wyświetlona lista subskrypcji, włącznie z informacjami o kliencie i tariffach.

2. **Formularz Dodawania Nowej Subskrypcji**:
   - Użytkownik może wybrać klienci i drzewo urządzeń.
   - Możesz określić datę rozpoczęcia i zakończenia subskrypcji, a także tariff.

3. **Zmiana Stanu Subskrypcji**:
   - Użytkownik może włączyć lub wyłączać subskrypcję.

4. **Usuwanie Subskrypcji**:
   - Użytkownik może usunąć subskrypcję z bazy danych.

### Przykładowe Użycie

- **Zobacz listę subskrypcji**: `/subscriptions`
- **Dodaj nową subskrypcję**: `/subscriptions/new`
- **Wyświetl drzewo urządzeń dla kliencza**: `/customer-nodes/{customer_id}`
- **Zmień stan subskrypcji**: `/subscriptions/{sub_id}/toggle`
- **Usuń subskrypcję**: `/subscriptions/{sub_id}/delete`