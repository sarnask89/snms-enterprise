import io
import xml.etree.ElementTree as ET
from typing import BinaryIO

def _clean(val: str | None) -> str | None:
    if val is None: return None
    v = val.strip()
    return v if v else None

def import_terc_xml(xml_file: BinaryIO):
    context = ET.iterparse(xml_file, events=("end",))
    states_data = {}
    districts_data = []
    
    for _, elem in context:
        if elem.tag == "row":
            woj = _clean(elem.findtext('WOJ'))
            powiat = _clean(elem.findtext('POW'))
            gmina = _clean(elem.findtext('GMI'))
            nazwa = _clean(elem.findtext('NAZWA'))
            
            if woj and not powiat and not gmina:
                states_data[woj] = nazwa.capitalize()
            elif woj and powiat and not gmina:
                districts_data.append((woj, powiat, nazwa))
            elem.clear()
    
    # Simulate the unpacking error in the loop
    print("Looping through districts_data...")
    for woj_code, pow_code, name in districts_data:
        print(f"Unpacked: {woj_code}, {pow_code}, {name}")

# Test data
xml_content = """<teryt>
<row><WOJ>02</WOJ><POW></POW><GMI></GMI><NAZWA>DOLNOŚLĄSKIE</NAZWA></row>
<row><WOJ>02</WOJ><POW>01</POW><GMI></GMI><NAZWA>bolesławiecki</NAZWA></row>
</teryt>"""

f = io.BytesIO(xml_content.encode('utf-8'))
import_terc_xml(f)
print("Success")
