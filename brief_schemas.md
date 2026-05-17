Ten kod definiuje modele danych dla klasy `Customer` i klasy `SupportTicket`, które są używane do reprezentacji danych o klientach i zgłoszeniach w aplikacji. Wszystkie klasy dziedziczą po klasie `BaseModel` z modułu `pydantic`. 

1. **CustomerBase**: Model bazowy dla klasy `Customer`, który zawiera informacje o klientach, takie jak kod klienta, imię i nazwisko, adres e-mail, numer telefonu, status klienta, id lokalizacji, id powiatu, id miasta, id ulicy i numer ulicy. Wszystkie pola są wymagane (zakończony znakiem `...`) i mają maksymalne długości 32, 128, 128, 64, 32, 255, 32, 64, 32, 32, 32, 32, 32, 32 i 32 znaków, odpowiednio.

2. **CustomerCreate**: Model dla tworzenia nowych klientów. Wszystkie pola są wymagane (zakończony znakiem `...`).

3. **CustomerUpdate**: Model dla aktualizacji istniejących klientów. Wszystkie pola są opcjonalne (zakończony znakiem `...`).

4. **CustomerRead**: Model dla odczytu danych o klientach. Dodano konfigurację zwracania danych w formacie `from_attributes=True`, aby automatycznie przekonwertować pola do odpowiednich typów.

5. **SupportTicketBase**: Model bazowy dla klasy `SupportTicket`, który zawiera informacje o zgłoszeniach, takie jak tytuł, treść, status zgłoszenia, kanał, id kanału, id kategorii, id klienta i id przypisanej osoby. Wszystkie pola są wymagane (zakończony znakiem `...`) i mają maksymalne długości 255, 32, 32, 64, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32 i 32 znaków, odpowiednio.

6. **SupportTicketCreate**: Model dla tworzenia nowych zgłoszeń. Wszystkie pola są wymagane (zakończony znakiem `...`).

7. **SupportTicketUpdate**: Model dla aktualizacji istniejących zgłoszeń. Wszystkie pola są opcjonalne (zakończony znakiem `...`).

8. **SupportTicketRead**: Model dla odczytu danych o zgłoszeniach. Dodano konfigurację zwracania danych w formacie `from_attributes=True`, aby automatycznie przekonwertować pola do odpowiednich typów.

9. **CustomerStatus** i **TicketStatus**: Definiują wartości dla statusu klienta i zgłoszenia, które są używane jako opcjonalne pola w modelach danych.

10. **LocationStateId**, **LocationDistrictId**, **LocationCityId**, **LocationStreetId**: Definiują wartości dla identyfikatorów lokalizacji, powiatu, miasta i ulicy, które są używane jako opcjonalne pola w modelach danych.

11. **QueueId**: Definiuje wartość dla identyfikatora kanału, który jest używany jako opcjonalne pole w modelach danych.

12. **CategoryId**: Definiuje wartość dla identyfikatora kategorii, który jest używany jako opcjonalne pole w modelach danych.

13. **CustomerId** i **AssigneeId**: Definiują wartości dla identyfikatorów klienta i przypisanej osoby, które są używane jako opcjonalne pola w modelach danych.

14. **CreatedAt**: Definiuje wartość dla daty i godziny tworzenia zgłoszenia, która jest używana jako opcjonalne pole w modelach danych.