Przeanalizowany kod jest implementacją klasy `ServiceRegistry` w języku Python. Ten klasa zarządza serwisami i umożliwia ich startowania i zatrzymania.

### Funkcje i Zależności

1. **__init__**:
   - Inicjalizuje listę serwisów (`self._services`) jako pustą listę.
   - Inicjalizuje logger z nazwą "app.services.registry".

2. **register**:
   - Dodaje nowy serwis do listy `_services`.
   - Loguje informację o dodaniu serwisu.

3. **start_all**:
   - Inicjalizuje logowanie informacji o startowaniu wszystkich serwisów.
   - Używa `asyncio.gather` do uruchomienia metod `start()` dla każdego serwisu, który posiada metodę `start()`.
   - Loguje informację o zakończeniu startowania wszystkich serwisów.

4. **stop_all**:
   - Inicjalizuje logowanie informacji o zatrzymaniu wszystkich serwisów.
   - Używa `asyncio.gather` do uruchomienia metod `stop()` dla każdego serwisu, który posiada metodę `stop()`.
   - Loguje informację o zakończeniu zatrzymania wszystkich serwisów.

### Struktura Klasy

- **__init__**:
  - Inicjalizacja listy serwisów.
  - Inicjalizacja loggera.

- **register**:
  - Dodanie nowego serwisu do listy `_services`.

- **start_all**:
  - Inicjalizacja logowania startu wszystkich serwisów.
  - Użycie `asyncio.gather` do uruchomienia metod `start()` dla każdego serwisu, który posiada metodę `start()`.
  - Logowanie informacji o zakończeniu startowania wszystkich serwisów.

- **stop_all**:
  - Inicjalizacja logowania zatrzymania wszystkich serwisów.
  - Użycie `asyncio.gather` do uruchomienia metod `stop()` dla każdego serwisu, który posiada metodę `stop()`.
  - Logowanie informacji o zakończeniu zatrzymania wszystkich serwisów.

### Używanie

1. **Inicjalizacja**:
   ```python
   service_registry = ServiceRegistry()
   ```

2. **Rejestrowanie Serwisu**:
   ```python
   class MyService:
       def start(self):
           print("Starting MyService")

       def stop(self):
           print("Stopping MyService")

   my_service = MyService()
   service_registry.register(my_service)
   ```

3. **Startowanie i Zatrzymanie Serwisów**:
   ```python
   asyncio.run(service_registry.start_all())
   asyncio.run(service_registry.stop_all())
   ```

### Logowanie

- Informacje o dodaniu serwisu: `Registered service: MyService`
- Informacje o startowaniu wszystkich serwisów: `Starting all services...`
- Informacje o zatrzymaniu wszystkich serwisów: `Stopping all services...`