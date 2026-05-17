### Podsumowanie

Ten kod implementuje funkcje do zapisu plików przesyłanych przez użytkownika. W szczególności:

1. **Zapisywanie plików**:
   - Funkcja `_safe_suffix` sprawdza rozszerzenie pliku i usuwa niepotrzebne znaki.
   - Funkcja `save_document_upload` zapisuje plik do określonej ścieżki, przekształcając nazwę pliku na unikalny identyfikator (UUID) i sprawdzając rozszerzenie. Jeśli rozszerzenie nie jest zgodne z zdefiniowanymi dopuszczalnymi, błąd jest wyrzucony.
   - Funkcja `save_document_upload` przekształca plik do base64-encodowanej formacie i zapisuje go do pliku na dysku.

2. **Usuwanie plików**:
   - Funkcja `delete_stored_file` usuwa określony plik z ścieżki, jeśli ten plik istnieje.

### Zależności

- `fastapi`: Wskaźnik do biblioteki FastAPI, która umożliwia tworzenie aplikacji webowych.
- `pathlib`: Biblioteka Pythona do manipulowania ścieżkami.
- `uuid`: Biblioteka Pythona do generowania identyfikatorów unikalnych.

### Struktura kodu

1. **Funkcja `_safe_suffix`**:
   - Sprawdza rozszerzenie pliku i usuwa niepotrzebne znaki.
   - Zwraca rozszerzenie lub pusty string, jeśli nie ma rozszerzenia.

2. **Funkcja `save_document_upload`**:
   - Tworzy unikalny identyfikator (UUID) dla pliku.
   - Sprawdza rozszerzenie pliku i usuwa niepotrzebne znaki.
   - Zapisuje plik do określonej ścieżki, przekształcając nazwę pliku na unikalny identyfikator (UUID) i sprawdzając rozszerzenie. Jeśli rozszerzenie nie jest zgodne z zdefiniowanymi dopuszczalnymi, błąd jest wyrzucony.
   - Zapisuje plik do pliku na dysku.

3. **Funkcja `delete_stored_file`**:
   - Usuwa określony plik z ścieżki, jeśli ten plik istnieje.