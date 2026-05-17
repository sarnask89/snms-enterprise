### Podsumowanie

Ten kod implementuje funkcjonalność zarządzania dokumentami w aplikacji. Wszystkie operacje są wykonywane za pomocą FastAPI, SQLAlchemy i zgodnie z konfiguracją aplikacji.

#### Funkcje:

1. **Document List**:
   - Zwraca listę wszystkich dokumentów wraz z informacjami o kliencie.
   - Używa funkcji `render` do generowania HTML-strony z listą dokumentów.

2. **New Document Form**:
   - Pobiera listę klientów i renderuje formularz dodawania nowego dokumentu.
   - Używa funkcji `render` do generowania HTML-strony z formularzem.

3. **Document New Submit**:
   - Przetwarza formularz dodawania dokumentu, sprawdzając wymagania i przekazując dane do bazy danych.
   - Używa funkcji `save_document_upload` do zapisywania pliku na dysku.
   - Używa funkcji `render` do generowania HTML-strony z informacjami o błędzie lub sukcesie.

4. **Document Download**:
   - Pobiera dokument z bazy danych i renderuje go jako odpowiedź HTTP.
   - Używa funkcji `FileResponse` do przekazania pliku w formacie, który odpowiada MIME-typowi dokumentu.

5. **Document Delete**:
   - Usuwa dokument z bazy danych i usuwa plik z dysku.
   - Używa funkcji `delete_stored_file` do usuwania pliku na dysku.
   - Używa funkcji `render` do generowania HTML-strony z informacjami o błędzie lub sukcesie.

#### Zależności:

1. **FastAPI**: Wskaźnik do API FastAPI.
2. **SQLAlchemy**: Kwantyfikator bazy danych SQLAlchemy.
3. **app/models**: Modeli bazy danych.
4. **app/config**: Konfiguracja aplikacji.
5. **app/deps**: Funkcje dekoratory.
6. **app/storage**: Funkcje obsługujące zapisy i usuwanie plików.
7. **app/templating**: Funkcja renderująca HTML-strony.

#### Struktura kodu:

1. **Rozdzielenie funkcji**:
   - `document_list`, `document_new_form`, `document_new_submit`, `document_download`, `document_delete` są rozdzielone na różne funkcje, które wykonują różne czynności.

2. **Użycie dekoratorów**:
   - `@router.get`, `@router.post`, `@router.delete` są używane do definiowania routingu API.
   - `Depends(verify_session)` jest używana do sprawdzania czy zalogowany użytkownik ma prawa dostępu.

3. **Użycie funkcji bazy danych**:
   - `get_db`, `require_business_write` są używane do pobierania i walidacji obiektów bazy danych.

4. **Użycie funkcji zapisu plików**:
   - `save_document_upload` jest używana do zapisywania pliku na dysku.

5. **Użycie funkcji renderowania HTML-strony**:
   - `render` jest używana do generowania HTML-strony z informacjami o błędzie lub sukcesie.

6. **Użycie funkcji usuwania plików**:
   - `delete_stored_file` jest używana do usuwania pliku na dysku.

7. **Użycie funkcji przekazywania plików**:
   - `File`, `UploadFile` są używane do przekazywania plików w formularzu.

### Przykładowe wywołanie:

```python
# Zapisywanie dokumentu
response = requests.post("http://localhost:8000/documents/new", files={"file": open("example.pdf", "rb")})

# Pobranie dokumentu
response = requests.get("http://localhost:8000/documents/1/download")

# Usunięcie dokumentu
response = requests.delete("http://localhost:8000/documents/1/delete")
```

### Uwagi:

- Wszystkie operacje są wykonywane zgodnie z konfiguracją aplikacji.
- Funkcje dekoratory (`@router.get`, `@router.post`, `@router.delete`) spraw