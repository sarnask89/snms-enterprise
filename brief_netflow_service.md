### Podsumowanie Użytych Funkcji i Zależności

#### Funkcje:

1. **NetFlowV5Parser.parse(data: bytes) -> List[Dict[str, Any]]**:
   - Parsuje pakiet NetFlow Version 5.
   - Wczytuje nagłówek i rekordy pakietu.
   - Zwraca listę słowników, gdzie każdy słownik reprezentuje pojedynczy przesyłek NetFlow.

2. **NetFlowProtocol(datagram: bytes, addr: tuple[str, int])**:
   - Implementacja protokołu datagramowego dla NetFlow.
   - Przetwarza pakiet datagramowy i wywołuje `handle_packet`.

3. **NetFlowService(host: str = "0.0.0.0", port: int = 2055)**:
   - Inicjalizacja serwera NetFlow.
   - Ustawia host i port, inicjalizuje zbiór agregatów przesyłek NetFlow i stan uruchomienia.

#### Zależności:

1. **asyncio**: Wskaźnik do biblioteki asyncio, umożliwiającej asynchroniczne wykonywanie kodu.
2. **logging**: Biblioteka do logowania informacji.
3. **json**: Biblioteka do manipulacji obiektem JSON.
4. **struct**: Biblioteka do manipulacji strukturami danych.
5. **socket**: Biblioteka do tworzenia i zarządzania socketami.
6. **datetime**: Biblioteka do manipulacji datą i czasem.
7. **typing**: Biblioteka do typowania danych.
8. **app.database**: Moduł z bazą danych, zawierający definicję klasy `SessionLocal`.
9. **app.models**: Moduł z modelami bazy danych, zawierający definicje klasy `NetFlowAggregate`.

#### Struktura Kody:

1. **NetFlowV5Parser**:
   - Wczytuje nagłówek i rekordy pakietu NetFlow.
   - Zwraca listę słowników, gdzie każdy słownik reprezentuje pojedynczy przesyłek NetFlow.

2. **NetFlowProtocol**:
   - Implementacja protokołu datagramowego dla NetFlow.
   - Przetwarza pakiet datagramowy i wywołuje `handle_packet`.

3. **NetFlowService**:
   - Inicjalizacja serwera NetFlow.
   - Ustawia host i port, inicjalizuje zbiór agregatów przesyłek NetFlow i stan uruchomienia.

4. **_aggregate_flows**:
   - Agreguje przesyłki NetFlow do bazy danych.
   - Zapisuje agregaty do bazy danych w celu wykonywania raportów.

5. **_periodic_flush**:
   - Wykrywa i zapisuje agregaty przesyłek NetFlow co 30 sekund.

### Używanie:

1. **Inicjalizacja Serwera**:
   ```python
   netflow_service = NetFlowService()
   ```

2. **Start Collector**:
   ```python
   asyncio.run(netflow_service.start_collector())
   ```

3. **Przetwarzanie Pakietów**:
   - Wysyłka pakietów NetFlow do serwera.
   ```python
   netflow_service.handle_packet(data, source_ip)
   ```

4. **Zapis Agregatów**:
   - Wykrywanie i zapisanie agregatów przesyłek NetFlow co 30 sekund.
   ```python
   asyncio.run(netflow_service._periodic_flush())
   ```

### Uwagi:

- Proszę pamiętać, że implementacja protokołu datagramowego NetFlow jest podstawowa i nie obsługuje wszystkich przypadków. Przykro mi za błędy lub brakujące funkcjonalności.
- Zależy na poprawnej konfiguracji hosta i portu, aby serwer mogł działać poprawnie.
- Proszę pamiętać o zabezpieczeniu przed atakami w sieci.