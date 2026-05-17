Ten kod definiuje modeli bazy danych SQLAlchemy dla systemu zarządzania klientami. Modely reprezentują klasy w bazie danych, a relacje między nimi są definowane za pomocą relacji ForeignKey i_relationship.

1. **CustomerGroup**: Klasa reprezentują grupę klientów. W tym modelu:
   - `id`: Unikalny identyfikator grupy.
   - `name`: Nazwa grupy.
   - `description`: Opis grupy.
   - `customers`: Lista klientów, które są członkami tej grupy.

2. **Customer**: Klasa reprezentuje klienta. W tym modelu:
   - `id`: Unikalny identyfikator klienta.
   - `customer_code`: Kod klienta.
   - `first_name`: Imię klienta.
   - `last_name`: Nazwisko klienta.
   - `email`: Adres e-mail klienta (opcjonalnie).
   - `phone`: Numer telefonu klienta (opcjonalnie).
   - `status`: Staus klienta (domyślnie "active").
   - `creation_date`: Data utworzenia klienta.
   - `notes`: Uwagi o klientie.
   
   **Client Portal Credentials**: Klasa reprezentuje kredencje dostępu do portalu klienta. W tym modelu:
   - `portal_login`: Login do portalu klienta (opcjonalnie).
   - `portal_password_hash`: Hasło do portalu klienta (opcjonalnie).
   - `last_portal_login`: Data ostatniej logowania do portalu klienta.

3. **Location**: Klasa reprezentuje lokalizację. W tym modelu:
   - `id`: Unikalny identyfikator lokalizacji.
   - `name`: Nazwa lokalizacji.
   
4. **LocationState**: Klasa reprezentuje stan lokalizacji. W tym modelu:
   - `id`: Unikalny identyfikator stanu lokalizacji.
   - `name`: Nazwa stanu lokalizacji.

5. **LocationDistrict**: Klasa reprezentuje powiat lokalizacji. W tym modelu:
   - `id`: Unikalny identyfikator powiatu lokalizacji.
   - `name`: Nazwa powiatu lokalizacji.

6. **LocationCity**: Klasa reprezentuje miasto lokalizacji. W tym modelu:
   - `id`: Unikalny identyfikator miasta lokalizacji.
   - `name`: Nazwa miasta lokalizacji.

7. **LocationStreet**: Klasa reprezentuje ulicę lokalizacji. W tym modelu:
   - `id`: Unikalny identyfikator ulicy lokalizacji.
   - `name`: Nazwa ulicy lokalizacji.

8. **CustomerDevice**: Klasa reprezentuje urządzenie klienta. W tym modelu:
   - `id`: Unikalny identyfikator urządzenia klienta.
   - `customer_id`: Identyfikator klienta, do którego należy przyporządkować urządzenie.
   
9. **Subscription**: Klasa reprezentuje subskrypcję klienta. W tym modelu:
   - `id`: Unikalny identyfikator subskrypcji klienta.
   - `customer_id`: Identyfikator klienta, do którego należy przyporządkować subskrypcję.

10. **Invoice**: Klasa reprezentuje fakturę klienta. W tym modelu:
    - `id`: Unikalny identyfikator faktury klienta.
    - `customer_id`: Identyfikator klienta, do którego należy przyporządkować fakturę.

11. **SupportTicket**: Klasa reprezentuje zgłoszenie obsługi klienta. W tym modelu:
    - `id`: Unikalny identyfikator zgłoszenia obsługi klienta.
    - `customer_id`: Identyfikator klienta, do którego należy przyporządkować zgłoszenie.

12. **Document**: Klasa reprezentuje dokument klienta. W tym modelu:
    - `id`: Unikalny identyfikator dokumentu klienta.
    - `customer_id`: Identyfikator klienta, do którego należy przyporządkować dokument.

13. **CustomerNotice**: Klasa reprezentuje powiadomienie klienta. W tym modelu:
    - `id`: Unikalny identy