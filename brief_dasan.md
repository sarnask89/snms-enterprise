### Podsumowanie

Ten kod implementuje funkcje do zarządzania urządzeniami DASAN (Distributed Access Switching Network). W szczególności:

1. **Klasyfikacja ONU**:
   - `get_onu_path`: Lokalizuje ONU na OLT na podstawie adresu MAC.
   - `get_onu_and_macs`: Pobiera listę ONU oraz tablicę MAC z OLT.

2. **Parsowanie danych**:
   - `_parse_onu`: Parsuje tabelę `show onu active`.
   - `_parse_macs`: Parsuje tabelę `show mac` i `show olt mac`.

3. **Zapytanie do ONU**:
   - `get_onu_macs`: Pobiera adresy MAC widoczne za konkretnym ONU (Poziom 2).

4. **Komunikacja SSH**:
   - `_get_connection`: Tworzy interaktywną sesję SSH.
   - `_send_cmd`: Wysyła komendę i czyta całe wyjście aż do pojawienia się promptu.

5. **Logging**:
   - Używa `logging` do zapisywania informacji i błędów.

### Zależności

- `paramiko`: Do obsługi SSH.
- `typing`: Typing dla funkcji.
- `re`: Re for regular expressions.
- `time`: For delays and timeouts.

### Struktura kodu

1. **Klasa `DasanService`**:
   - Konstruktor z parametrami host, user, password i port.
   - Metody `get_onu_path`, `get_onu_and_macs`, `_parse_onu`, `_parse_macs`, `_send_cmd`, `_get_connection`.

2. **Metody prywatne**:
   - `_send_cmd`: Wysyła komendę do OLT i czeka na odpowiedź.
   - `_get_connection`: Utwóra i połącza się z OLT.

3. **Metody publiczne**:
   - `get_onu_path`: Lokalizuje ONU na OLT.
   - `get_onu_and_macs`: Pobiera listę ONU oraz tablicę MAC.
   - `get_onu_macs`: Pobiera adresy MAC widoczne za konkretnym ONU.

4. **Parsowanie**:
   - `_parse_onu` i `_parse_macs`: Parsują dane z wyjścia OLT.

5. **Logging**:
   - Używa `logging` do zapisywania informacji i błędów.

### Przykładowy użycie

```python
service = DasanService('192.168.1.1', 'admin', 'password')
result = service.get_onu_and_macs()
print(result)
```

Ten kod umożliwia zarządzanie ONU w DASAN, zwracając listę ONU oraz tablicę MAC, a także adresy MAC widoczne za konkretnym ONU.