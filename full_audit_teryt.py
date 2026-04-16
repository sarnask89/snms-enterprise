import os
import sys
from sqlalchemy import select

# Ustawienie ścieżek
sys.path.insert(0, os.getcwd())

from app.database import SessionLocal
from app import models, teryt_ws

def audit_everything():
    db = SessionLocal()
    print("--- AUDYT SYSTEMU TERYT ---")
    
    # 1. Audyt Bazy
    district = db.query(models.LocationDistrict).get(299) # sandomierski
    if not district:
        print("BŁĄD: Brak powiatu o ID 299 w bazie.")
        return
    
    woj = district.state
    print(f"Baza: Powiat={district.name}, Województwo={woj.name}, KodWoj={woj.teryt_code}")
    
    # 2. Audyt API GUS (Gminy)
    print("\nAPI GUS: Pobieranie gmin dla Woj=" + str(woj.teryt_code) + ", Pow='09'")
    gminy, _ = teryt_ws.gminy_as_serializable(woj.teryt_code, "09")
    print(f"Wynik: Znalazło {len(gminy)} gmin.")
    
    if len(gminy) == 0:
        print("FAIL: GUS nie zwrócił żadnej gminy dla tych kodów.")
        return

    # 3. Audyt API GUS (Miejscowości)
    total_msc = 0
    for g in gminy:
        gmi_code = g.get('GMI')
        gmi_name = g.get('NAZWA')
        msc, _ = teryt_ws.miejscowości_as_serializable(woj.teryt_code, "09", gmi_code)
        print(f"  Gmina {gmi_name} (GMI={gmi_code}): {len(msc)} miejscowości")
        total_msc += len(msc)
        
    print(f"\nŁącznie do dodania: {total_msc}")
    
    # 4. Audyt zapisu do bazy
    if total_msc > 0:
        print("\nTest zapisu jednego rekordu...")
        try:
            m_test = models.LocationCity(district_id=299, name="Testowe Miasto")
            db.add(m_test)
            db.flush()
            print("Zapis do bazy działa.")
            db.rollback()
        except Exception as e:
            print(f"BŁĄD ZAPISU: {e}")

    db.close()

if __name__ == "__main__":
    audit_everything()
