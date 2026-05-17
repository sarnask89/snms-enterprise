### Podsumowanie

Ten kod implementuje funkcje do generowania logów i hasłów. Wszystkie funkcje korzystają z modułów `string`, `random` i `unicodedata`. 

1. **normalize_polish_chars(text: str) -> str**: 
   - Zwraca tekst, w którym wszystkie polskie znaki są zamienione na ich odpowiednie znaki ASCII.
   - Przykładowe użycie:
     ```python
     normalized_text = normalize_polish_chars("Kwiatkowski")
     print(normalized_text)  # Output: kwiatkowski
     ```

2. **generate_login(surname: str, street_name: str, street_number: str, apartment_number: str) -> str**: 
   - Tworzy logi w formacie `[surname][street_number][3_letters_of_last_word_of_street][apartment_number]`.
   - Przykładowe użycie:
     ```python
     login = generate_login("Kwiatkowski", "Gen Lina Żółkiewskiego", 9, "ap 10")
     print(login)  # Output: kwiatkowski9zol10
     ```

3. **generate_password(length: int = 12) -> str**: 
   - Tworzy losowe hasła z literami, znaków specjalnymi i cyframi.
   - Przykładowe użycie:
     ```python
     password = generate_password()
     print(password)  # Output: jklmnpqrstvwxyz0123456789!@#$%^&*
     ```

### Zależności

- `string`: Przechowuje ciągi znaków specjalnych.
- `random`: Generuje losowe wartości.
- `unicodedata`: Dostarcza funkcje do manipulacji znakami Unicode.

### Struktura kodu

1. **normalize_polish_chars**: Zmienia polskie znaki na ich odpowiednie znaki ASCII.
2. **generate_login**: Tworzy logi w formacie `[surname][street_number][3_letters_of_last_word_of_street][apartment_number]`.
3. **generate_password**: Tworzy losowe hasła z literami, znaków specjalnymi i cyframi.

### Przykładowe użycie

```python
# Normalizacja polskich znaków
normalized_text = normalize_polish_chars("Kwiatkowski")
print(normalized_text)  # Output: kwiatkowski

# Generowanie logu
login = generate_login("Kwiatkowski", "Gen Lina Żółkiewskiego", 9, "ap 10")
print(login)  # Output: kwiatkowski9zol10

# Generowanie hasła
password = generate_password()
print(password)  # Output: jklmnpqrstvwxyz0123456789!@#$%^&*
```

### Wersja z dodatkową kontrolą znaków specjalnymi

Jeśli potrzebujesz dodatkowej kontrolki znaków specjalnymi, możesz zmodyfikować funkcję `generate_password` do uwzględnienia tych znaków.