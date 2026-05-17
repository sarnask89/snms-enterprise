Ten kod definiuje trzy modele bazy danych SQLAlchemy: `MessageTemplate`, `OutboundMessage` i `CalendarEvent`. 

1. **MessageTemplate**: 
   - Zawiera informacje o szablonie wiadomości, takie jak nazwa, temat i treść.
   - Używane w tabeli `message_templates`.

2. **OutboundMessage**:
   - Przechowuje informacje o wysłanych wiadomościach.
   - Relacja z szablonem wiadomości (`template_id`).
   - Używana w tabeli `outbound_messages`.

3. **CalendarEvent**:
   - Zawiera informacje o wydarzeniu, takie jak tytuł, opis i daty rozpoczęcia i zakończenia.
   - Relacja z klientem (`customer_id`).
   - Używana w tabeli `calendar_events`.

Każdy model ma pola:
- `id`: Unikalny identyfikator dla każdego rekordu.
- `name`, `subject`, `body`: Pole tekstowe, które mogą być puste.
- `customer_id`: Pole numerującego klienta (opcjonalne).
- `status`: Pole z enumeracją stanów wiadomości (`MessageStatus`), domyślnie jest ustawione na `draft`.
- `created_at`, `sent_at`: Pole datowe, które zawierają datę i czas utworzenia lub wysłania wiadomości (opcjonalne).

Wszystkie pola są opcjonalne, co oznacza, że nie muszą być przekazywane podczas tworzenia nowego rekordu.