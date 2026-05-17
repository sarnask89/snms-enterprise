Ten kod definiuje trzy klasy modeli SQLAlchemy: `OfficeEquipment`, `VehiclesCli`, i `ExtServicesCli`. Kаждая z tych klas reprezentuje tabelę w bazie danych SQL. 

1. **OfficeEquipment**: Ta klasa reprezentuje tabelę "office_equipment" w bazie danych. Zawiera następujące pola:
   - `id`: Unikalny identyfikator dla każdego urządzenia.
   - `item_name`: Nazwa urządzenia (opcjonalnie).
   - `serial_number`: Numer seryzualny urządzenia (opcjonalnie).
   - `quantity`: Ilość urządzeń (opcjonalnie).

2. **VehiclesCli**: Ta klasa reprezentuje tabelę "vehicles_cli" w bazie danych. Zawiera następujące pola:
   - `id`: Unikalny identyfikator dla każdego pojazdu.
   - `brand`: Marka pojazdu (opcjonalnie).
   - `model`: Model pojazdu (opcjonalnie).
   - `plate`: Numer rejestracyjny pojazdu (opcjonalnie).
   - `is_available`: Czy pojazd jest dostępny (opcjonalnie).

3. **ExtServicesCli**: Ta klasa reprezentuje tabelę "ext_services_cli" w bazie danych. Zawiera następujące pola:
   - `id`: Unikalny identyfikator dla każdego usługi ekstensyjnej.
   - `service_name`: Nazwa usługi ekstensyjnej (opcjonalnie).
   - `cost`: Cena usługi ekstensyjnej (opcjonalnie).
   - `notes`: Notatki lub opisy dla usługi ekstensyjnej (opcjonalnie).

Każda z tych klas ma asocjacje z tabelami w bazie danych, które są definiowane przez metody `mapped_column` i `primary_key`. Ta struktura modelu SQLAlchemy umożliwia efektywne zarządzanie danymi w bazie danych.