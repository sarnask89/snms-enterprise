### Podsumowanie

Ten kod jest skryptem Pythona, który importuje pliki XML zawierające dane geograficzne w różnych formatach (TERC, SIMC, ULIC) do bazy danych SQLAlchemy. Wszystkie funkcje to odpowiedzialne za importowanie poszczególnych typów danych:

1. **import_terc_xml(db: Session, xml_file: BinaryIO)**:
   - Importuje plik TERC (województwa, powiaty, gminy).
   - Wczytuje plik XML iteratorem `ET.iterparse`.
   - Przetwarza każdy element XML, zwracając tylko te, które zawierają informacje o województwach.
   - Zapisuje województwa do bazy danych SQLAlchemy.

2. **import_simc_xml(db: Session, xml_file: BinaryIO)**:
   - Importuje plik SIMC (miejscowości).
   - Wczytuje plik XML iteratorem `ET.iterparse`.
   - Przetwarza każdy element XML, zwracając tylko te, które zawierają informacje o miejscach.
   - Zapisuje miejsca do bazy danych SQLAlchemy.

3. **import_ulic_xml(db: Session, xml_file: BinaryIO)**:
   - Importuje plik ULIC (ulice).
   - Wczytuje plik XML iteratorem `ET.iterparse`.
   - Przetwarza każdy element XML, zwracając tylko te, które zawierają informacje o ulicach.
   - Zapisuje ulice do bazy danych SQLAlchemy.

### Używanie

- **import_terc_xml(db: Session, xml_file: BinaryIO)**:
  - Przyjmuje obiekt sesji SQLAlchemy `db` i plik XML w formacie binarnym `xml_file`.
  - Importuje województwa, powiaty i gminy.

- **import_simc_xml(db: Session, xml_file: BinaryIO)**:
  - Przyjmuje obiekt sesji SQLAlchemy `db` i plik XML w formacie binarnym `xml_file`.
  - Importuje miejsca (miejscowości).

- **import_ulic_xml(db: Session, xml_file: BinaryIO)**:
  - Przyjmuje obiekt sesji SQLAlchemy `db` i plik XML w formacie binarnym `xml_file`.
  - Importuje ulice.

### Zależności

- **sqlalchemy**: Wskaźnik do bazy danych SQLAlchemy.
- **xml.etree.ElementTree**: Moduł Pythona do parsowania XML.
- **app.models**: Modely bazy danych, które są używane w funkcjach importacji.