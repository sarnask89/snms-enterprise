# Dokumentacja techniczna

## 1. Opis modułu

Moduł `check_test_db` jest skryptem Pythona, który tworzy połączenie z bazą danych SQLite i wykonywuje zapytania do tej bazy. W tym przypadku, skrypt sprawdza zawartość tabeli `location_cities` i `location_streets`.

## 2. Funkcja `check_test_db`

### 2.1 Definicja

```python
def check_test_db():
```

### 2.2 Parametry

- `conn`: Połączenie z bazą danych SQLite.
- `cursor`: Kursor do wykonania zapytań.

### 2.3 Wprowadzenie

```python
    print("--- CITIES ---")
```

### 2.4 Wykonywanie zapytania i wypisywanie wyników

```python
    cities = cursor.execute("SELECT id, name FROM location_cities").fetchall()
    for c in cities:
        print(c)
```

### 2.5 Wprowadzenie

```python
    print("--- STREETS ---")
```

### 2.6 Wykonywanie zapytania i wypisywanie wyników

```python
    streets = cursor.execute("SELECT id, name, city_id FROM location_streets").fetchall()
    for s in streets:
        print(s)
```

### 2.7 Zakończenie połączenia z bazą danych

```python
    conn.close()
```

### 2.8 Plik główny skryptu

```python
if __name__ == "__main__":
    check_test_db()
```

## 3. Użycie

Moduł `check_test_db` może być używany do sprawdzenia zawartości tabeli `location_cities` i `location_streets`. W celu uruchomienia skryptu, należy go zapisac w pliku Pythona (np. `check_test_db.py`) i wykonać za pomocą polecenia:

```sh
python check_test_db.py
```

## 4. Przykładowy output

Przykładowy output modułu może wyglądać następująco:

```
--- CITIES ---
(1, 'Warszawa')
(2, 'Kraków')
(3, 'Poznań')

--- STREETS ---
(4, 'Ulica A', 1)
(5, 'Ulica B', 2)
(6, 'Ulica C', 3)
```

## 5. Zasoby

- [SQLite](https://www.sqlite.org/)
- [Python SQLite](https://docs.python.org/3/library/sqlite3.html)