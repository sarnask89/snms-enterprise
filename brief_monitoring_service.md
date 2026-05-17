### Podsumowanie

Ten kod implementuje funkcjonalność monitorowania systemu, w tym:

1. **Ping Device**: Prognozuje odnalezienie i czas reakcji na urządzenie zgodnie z jego adresem IP.
2. **Check All Devices**: Sprawdza stan wszystkich infrastrukturalnych i klientowych urządzeń.
3. **Poll NVIDIA Infrastructure**: Zapytuje statystyki GPU w lokalnym systemie.
4. **Check Customer Device**: Simuluje przesyłanie danych do klienta, przyjmując zgodnie z subskrypcją prędkośći.
5. **Check Single Device**: Sprawdza stan pojedynczego urządzenia, uaktualniając jego status i czas ostatniej poglądania.
6. **Poll Item**: Zapytuje statystyki określonego elementu monitorowania (ICMP lub SNMP).
7. **Evaluate Triggers**: Wykrywaj warunki zdefiniowane w triggerech i przekształcają je na statusy systemu.
8. **Create Notification**: Tworzy powiadomienie o zdarzeniu.

### Zależności

- `asyncio`: Wątkowość asynchroniczna.
- `subprocess`: Wykonywanie polecenia w systemie.
- `time`: Obliczanie czasu.
- `random`: Generowanie losowych wartości.
- `datetime`: Obsługa daty i godziny.
- `sqlalchemy`: Modeli bazy danych.
- `app.database`: Klasa połączenia z bazą danych.
- `app.models.network`: Model infrastrukturalnych urządzeń.
- `app.models.monitoring`: Model statystyk monitorowania.
- `app.services.snmp_service`: Wskaźnik do serwisu SNMP.
- `app.services.nvidia_service`: Wskaźnik do serwisu NVIDIA.

### Struktura kodu

1. **Klasa `MonitoringService`**: Klasa, która zarządza wszystkimi asynchronicznymi operacjami monitorowania.
2. **Metody asynchroniczne**:
   - `ping_device`: Prognozuje odnalezienie i czas reakcji na urządzenie.
   - `check_all_devices`: Sprawdza stan wszystkich infrastrukturalnych i klientowych urządzeń.
   - `poll_gpus`: Zapytuje statystyki GPU w lokalnym systemie.
   - `check_customer_device`: Simuluje przesyłanie danych do klienta, przyjmując zgodnie z subskrypcją prędkośći.
   - `check_single_device`: Sprawdza stan pojedynczego urządzenia, uaktualniając jego status i czas ostatniej poglądania.
   - `poll_item`: Zapytuje statystyki określonego elementu monitorowania (ICMP lub SNMP).
   - `evaluate_triggers`: Wykrywaj warunki zdefiniowane w triggerech i przekształcają je na statusy systemu.
   - `create_notification`: Tworzy powiadomienie o zdarzeniu.
   - `seed_default_items`: Seeding default monitoring items for devices that have none.

### Używanie

1. **Inicjalizacja**: Inicjalizacja instancji klasy `MonitoringService`.
2. **Uruchomienie serwisu**: Uruchamianie metody `check_all_devices` do sprawdzenia stan wszystkich urządzeń.
3. **Zarządzanie powiadomieniami**: Używanie metody `create_notification` do tworzenia powiadomień o zdarzeniu.

### Przykładowe użycie

```python
import asyncio

async def main():
    monitoring_service = MonitoringService()
    await monitoring_service.check_all_devices()

if __name__ == "__main__":
    asyncio.run(main())
```

Ten kod jest przygotowany do uruchomienia w kontekście asynchronicznego systemu, gdzie można wykonywać wiele operacji jednocześnie.