Ten kod generuje plik GML compliant z UKE PIT wymagania dla węzłów (Nodes). Wartości współrzędnych muszą być w PUWG 1992 (EPSG:2180).

W tym kodzie używane są następujące funkcje i zależności:

1. `from typing import List`
   - Zawiera deklarację typów, które są potrzebne do kompilacji kodu.

2. `import xml.etree.ElementTree as ET`
   - Importuje bibliotekę ElementTree, która jest używana do tworzenia i manipulowania drzewem XML.

3. `from app import models`
   - Importuje modeli z aplikacji, które są potrzebne do pobrania danych węzłów.

4. `def generate_pit_gml(nodes: List[models.NetNode]) -> str`
   - Definiuje funkcję `generate_pit_gml`, która przyjmuje listę obiektów `NetNode` i zwraca string zawierający plik GML.

5. `ns = { "gml": "http://www.opengis.net/gml/3.2", "pit": "http://pit.uke.gov.pl/schema/infrastruktura/1.0", "xlink": "http://www.w3.org/1999/xlink", "xsi": "http://www.w3.org/2001/XMLSchema-instance" }`
   - Definiuje przestrzenie nazw (namespaces) używane w pliku GML.

6. `for prefix, uri in ns.items(): ET.register_namespace(prefix, uri)`
   - Registruje przestrzenie nazw w ElementTree, aby można było odwoływać się do nich w kodzie.

7. `root = ET.Element("{http://www.opengis.net/gml/3.2}FeatureCollection")`
   - Tworzy korzeń drzewa XML dla pliku GML.

8. `root.set("{http://www.opengis.net/gml/3.2}id", "pit_export_nodes")`
   - Ustawia identyfikator dla drzewa XML.

9. `for device in nodes:`
   - Iteruje po listie węzłów.

10. `if not device.x_1992 or not device.y_1992:`:
        continue
    - Sprawdza, czy współrzędne węzła są prawidłowe (niepuste).

11. `feature_member = ET.SubElement(root, "{http://www.opengis.net/gml/3.2}featureMember")`
    - Tworzy element `featureMember` dla każdego węzła.

12. `wezel = ET.SubElement(feature_member, "{http://pit.uke.gov.pl/schema/infrastruktura/1.0}Wezel")`
    - Tworzy element `Wezel` dla każdego węzła.

13. `wezel.set("{http://www.opengis.net/gml/3.2}id", f"node_{device.id}")`
    - Ustawia identyfikator dla węzła.

14. Attributes:
    - `id_wezla = ET.SubElement(wezel, "{http://pit.uke.gov.pl/schema/infrastruktura/1.0}ID_WEZLA")`
        - Ustawia identyfikator węzła.
    - `rodzaj = ET.SubElement(wezel, "{http://pit.uke.gov.pl/schema/infrastruktura/1.0}RODZAJ_WEZLA")`
        - Ustawia rodzaj węzła.
    - `status = ET.SubElement(wezel, "{http://pit.uke.gov.pl/schema/infrastruktura/1.0}STATUS")`
        - Ustawia status węzła.

15. Geometry (EPSG:2180):
    - `geometria = ET.SubElement(wezel, "{http://pit.uke.gov.pl/schema/infrastruktura/1.0}GEOMETRIA")`
        - Tworzy element `GEOMETRIA` dla węzła.
    - `point = ET.SubElement(geometria, "{http://www.opengis.net/gml/3.2}Point")`
        - Tworzy element `Point` dla węzła.
    - `point.set("{http://www.opengis.net/gml/3.2}id", f"p_{device.id}")`
        - Ustawia identyfikator dla punktu.
    - `point.set("srsName", "urn:ogc:def