### Podsumowanie

Ten kod generuje kolejne numeri dokumentów wg planu numeracji (SNMS). Wszystkie funkcje i operacje są realizowane w języku Python, używając bibliotek SQLAlchemy do interakcji z bazą danych. 

#### Funkcja `allocate_next_document_number`

- **Parametry**:
  - `db`: Sessja bazy danych.
  - `plan`: Model planu numeracji.

- **Wartość zwracana**:
  - Zwraca kolejny numer dokumentu w formacie `{year}/{month}/{day}/{n}` (liczba).

- **Przykład działania**:
  - Wyzwala funkcję z bieżącym datą i aktualnym licznikiem planu.
  - Formatuje numer na podstawie wzorca planu, dodając padding do liczby jeśli nie jest jawnego formatu.
  - Zwiększa licznik planu i zapisuje zmiany w bazie danych.

#### Używanie

1. **Importowanie modułów**:
   ```python
   from __future__ import annotations
   from datetime import date
   from sqlalchemy.orm import Session
   
   from app import models
   ```

2. **Użycie funkcji**:
   ```python
   db = Session()  # Utwórz sesję bazy danych
   plan = models.NumberPlan()  # Przygotuj model planu numeracji
   next_number = allocate_next_document_number(db, plan)  # Wygeneruj kolejny numer dokumentu
   ```

### Zależności

- **SQLAlchemy**: Do interakcji z bazą danych.
- **datetime**: Do manipulowania datami.

### Struktura kodu

1. **Importowanie modułów**:
   - `__future__`: Włącza nowe funkcje Pythona, takie jak f-stringi.
   - `datetime`: Używane do manipulacji datami.
   - `sqlalchemy.orm`: Do interakcji z bazą danych.
   - `app.models`: Model planu numeracji.

2. **Definicja funkcji**:
   - `allocate_next_document_number`: Zwraca kolejny numer dokumentu wg planu numeracji.

3. **Użycie funkcji**:
   - Utwórz sesję bazy danych.
   - Przygotuj model planu numeracji.
   - Wygeneruj kolejny numer dokumentu.

### Wersja

- **Data**: 2023-10-05
- **Autor**: [Twój Imię i Nazwisko]

---

Pozostańcie zgodne z licencją Apache 2.0.