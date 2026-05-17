Ten kod definiuje modeli bazy danych SQLAlchemy, które reprezentują struktury geograficzne w systemie. Modely to klasy Python, które definiują pola tabeli bazy danych i relacje między tabelami.

1. **LocationState**: Reprezentuje stan powiatu (region). Zawiera pola:
   - `id`: Unikalny identyfikator stanu powiatu.
   - `name`: Nazwa stanu powiatu.
   - `teryt_code`: Kod TERYTowy (identyfikator powiatu w systemie TERYT).
   - `is_active`: Czy stan powiatu jest aktywny.

2. **LocationDistrict**: Reprezentuje powiat (region). Zawiera pola:
   - `id`: Unikalny identyfikator powiatu.
   - `state_id`: Identyfikator stanu powiatu, do którego należy powiat.
   - `name`: Nazwa powiatu.
   - `teryt_code`: Kod TERYTowy (identyfikator powiatu w systemie TERYT).
   - `is_active`: Czy powiat jest aktywny.

3. **LocationCity**: Reprezentuje miasto (city). Zawiera pola:
   - `id`: Unikalny identyfikator miasta.
   - `district_id`: Identyfikator powiatu, do którego należy miasto.
   - `name`: Nazwa miasta.
   - `teryt_code`: Kod TERYTowy (identyfikator miasta w systemie TERYT).
   - `commune_code`: Kod komunalny (identyfikator miasta w systemie komunalnym).
   - `commune_type`: Typ komunalnego (np. gmina, powiat, miasto).
   - `is_managed`: Czy miasto jest zarządzane.
   - `is_default`: Czy miasto jest domyślnym.
   - `is_active`: Czy miasto jest aktywny.

4. **LocationStreet**: Reprezentuje ulicę (street). Zawiera pola:
   - `id`: Unikalny identyfikator ulicy.
   - `city_id`: Identyfikator miasta, do którego należy ulica.
   - `name`: Nazwa ulicy.
   - `teryt_code`: Kod TERYTowy (identyfikator ulicy w systemie TERYT).
   - `city`: Relacja zmienna na miasto, do którego należy ulica.

Wszystkie te klasy są połączone relacjami one-to-many, gdzie powiat może mieć wiele powiatów, miasto może mieć wiele powiatów i miasto może mieć wiele ulic. W tym przypadku, w tabeli `location_cities` jest używana relacja `cascade="all, delete-orphan"` do usuwania powiązanych danych po usunięciu miasta lub powiatu.