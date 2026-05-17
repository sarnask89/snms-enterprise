### Podsumowanie kodu

Ten kod implementuje funkcjonalność zarządzania urządzeniami sieciowymi w aplikacji. Wszystkie operacje są wykonywane za pomocą FastAPI, która umożliwia szybkie tworzenie interfejsów API. Zależności do autentykacji i autoryzacji są sprawdzane przez `verify_session` i `require_business_write`.

#### Funkcje:

1. **netdevice_list**: Lista urządzeń sieciowych, z opcjonalnym wyszukiwaniem po nazwie, hostname, IP lub typie urządzenia.
2. **netdevice_search_form**: Formularz wyszukiwania urządzeń.
3. **netdevice_add_alias**: Alias do formularza dodawania nowego urządzenia.
4. **netdevice_reports**: Raport zbiorczy osprzętu (druk / eksport).
5. **netdevice_reports_csv**: Export raportu jako plik CSV.
6. **netdevice_print_alias**: Alias do przekierowania do raportu.
7. **netdevice_new_form**: Formularz dodawania nowego urządzenia.
8. **netdevice_new_submit**: Przetwarzanie formularza dodawania nowego urządzenia.
9. **netdevice_edit_form**: Formularz edycji istniejącego urządzenia.
10. **netdevice_edit_submit**: Przetwarzanie formularza edycji istniejącego urządzenia.
11. **netdevice_delete**: Usuwanie urządzenia sieciowego.

#### Zależności:

- `models`: Modeli danych SQLAlchemy.
- `database`: Funkcja do pobierania sesji bazy danych.
- `deps`: Funkcje dekoratorowe z autentykacją i autorizacją.
- `templating`: Funkcja do renderowania szablonów HTML.
- `security_utils`: Funkcja do hashowania hasła.

#### Używanie:

1. **Lista urządzeń**: Zostaje dostarczona w formacie HTML, umożliwiające wyszukiwanie i edycję urządzeń.
2. **Formularz dodawania**: Możesz dodać nowe urządzenia za pomocą tego formularza.
3. **Raporty**: Możesz generować raport zbiorczy osprzętu w formacie CSV lub drukowany na stronie.
4. **Edycja i usuwanie**: Możesz edytować i usunąć istniejące urządzenia.

### Przykładowe wywołanie:

```python
# Zapisz kod do pliku net_devices.py

# Włączenie aplikacji FastAPI
from fastapi import FastAPI

app = FastAPI()

# Używanie routera z definowanymi funkcjami
app.include_router(router)

# Start serveru
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

W tym przykładzie kod jest uruchamiany za pomocą `uvicorn`, który otwiera serwer HTTP na porcie 8000.