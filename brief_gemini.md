### Podsumowanie

Ten kod implementuje funkcje do przetwarzania komentarzy technicznych z routera Mikrotik i wyodrębnić dane klienta w formacie JSON. W tym celu, używane są następujące funkcje:

1. **`__init__`**: Inicjalizacja klienta Gemini z ustawieniami systemowych (GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION). Używamy trybu Vertex AI dla zgodności z korporacyjnymi standardami Agent Platform.

2. **`smart_parse_comment`**: Używa Gemini do inteligentnego wyciągnięcia danych klienta z nieustrukturyzowanego komentarza. Jeśli komentarz jest pusty lub zawiera za mało znacznego tekstu, funkcja zwraca `None`. W przeciwnym przypadku, wywołuje `generate_content` do analizy komentarza i parsowania odpowiedzi w formacie JSON.

3. **`start_batch_job`**: Przykładowa implementacja zadania wsadowego (Batch Job) z webhookiem, zgodnie z przykładem dostarczonym przez użytkownika. W prawdziwym systemie użylibyśmy tego do analizy tysięcy rekordów.

### Zależności

- **`os`**: Do pobierania zmiennych środowiskowych.
- **`logging`**: Do wypisywania logów.
- **`json`**: Do parsowania JSON.
- **`genai`** i **`types`**: W przypadku, gdy `google` jest niezainstalowany, używane są puste wartości.

### Struktura kodu

1. **Klasa `GeminiService`**: Zawiera metody do przetwarzania komentarzy i konfiguracji zadania wsadowego.
2. **Singleton**: Używany do instancji klasy `GeminiService`.

### Przykładowy użycie

```python
gemini = GeminiService()
comment = "Jestem ekspertem systemów ISP CRM. Przeanalizuj poniższy komentarz techniczny z routera Mikrotik i spróbuj wyodrębnić dane abonenta w formacie JSON."
data = await gemini.smart_parse_comment(comment)
print(data)
```

### Logowanie

- Wypisywane są logi informacyjne i błędy przy wywołaniu funkcji.
- Logi używają formatu `%(asctime)s - %(levelname)s - %(message)s`.

### Zasady

1. Jeśli komentarz jest pusty lub zawiera za mało znacznego tekstu, funkcja zwraca `None`.
2. Jeśli nie znaleziono nazwiska, ustaw null.
3. Pomiń prefiksy typu 'sklep', 'p.' itp., chyba że są częścią nazwy.

### Przykładowe wywołanie

```python
gemini = GeminiService()
comment = "Jestem ekspertem systemów ISP CRM. Przeanalizuj poniższy komentarz techniczny z routera Mikrotik i spróbuj wyodrębnić dane abonenta w formacie JSON."
data = await gemini.smart_parse_comment(comment)
print(data)
```

### Zasady

1. Jeśli komentarz jest pusty lub zawiera za mało znacznego tekstu, funkcja zwraca `None`.
2. Jeśli nie znaleziono nazwiska, ustaw null.
3. Pomiń prefiksy typu 'sklep', 'p.' itp., chyba że są częścią nazwy.