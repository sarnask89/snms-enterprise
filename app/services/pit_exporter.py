from typing import List
import xml.etree.ElementTree as ET
from app import models

def generate_pit_gml(nodes: List[models.NetNode]) -> str:
    """
    Generates a GML file compliant with UKE PIT requirements for Węzły (Nodes).
    Coordinates must be in PUWG 1992 (EPSG:2180).
    """
    
    # Namespaces usually required by UKE GML
    ns = {
        "gml": "http://www.opengis.net/gml/3.2",
        "pit": "http://pit.uke.gov.pl/schema/infrastruktura/1.0",
        "xlink": "http://www.w3.org/1999/xlink",
        "xsi": "http://www.w3.org/2001/XMLSchema-instance"
    }
    
    for prefix, uri in ns.items():
        ET.register_namespace(prefix, uri)

    root = ET.Element("{http://www.opengis.net/gml/3.2}FeatureCollection")
    root.set("{http://www.opengis.net/gml/3.2}id", "pit_export_nodes")
    
    for device in nodes:
        if not device.x_1992 or not device.y_1992:
            continue
            
        feature_member = ET.SubElement(root, "{http://www.opengis.net/gml/3.2}featureMember")
        wezel = ET.SubElement(feature_member, "{http://pit.uke.gov.pl/schema/infrastruktura/1.0}Wezel")
        wezel.set("{http://www.opengis.net/gml/3.2}id", f"node_{device.id}")
        
        # Attributes
        id_wezla = ET.SubElement(wezel, "{http://pit.uke.gov.pl/schema/infrastruktura/1.0}ID_WEZLA")
        id_wezla.text = str(device.id)
        
        rodzaj = ET.SubElement(wezel, "{http://pit.uke.gov.pl/schema/infrastruktura/1.0}RODZAJ_WEZLA")
        rodzaj.text = device.uke_node_kind or "szafa telekomunikacyjna"
        
        status = ET.SubElement(wezel, "{http://pit.uke.gov.pl/schema/infrastruktura/1.0}STATUS")
        status.text = "Istniejąca"
        
        # Geometry (EPSG:2180)
        geometria = ET.SubElement(wezel, "{http://pit.uke.gov.pl/schema/infrastruktura/1.0}GEOMETRIA")
        point = ET.SubElement(geometria, "{http://www.opengis.net/gml/3.2}Point")
        point.set("{http://www.opengis.net/gml/3.2}id", f"p_{device.id}")
        point.set("srsName", "urn:ogc:def:crs:EPSG::2180")
        
        pos = ET.SubElement(point, "{http://www.opengis.net/gml/3.2}pos")
        # GML standard for EPSG:2180 is usually X Y (North East) in meters
        pos.text = f"{device.x_1992} {device.y_1992}"

    # Return as string
    return ET.tostring(root, encoding="unicode", method="xml")
