import os
import sys
from zeep.helpers import serialize_object

# Dodaj path
sys.path.insert(0, os.getcwd())

from app.database import SessionLocal
from app import models, teryt_ws

def deep_audit():
    db = SessionLocal()
    print("--- START AUDYTU TERYT ---")
    
    # 1. Sprawdź powiat sandomierski w bazie
    d = db.query(models.LocationDistrict).filter(models.LocationDistrict.name.ilike('%sandom%')).first()
    if not d:
        print("FAIL: Nie znaleziono powiatu w bazie.")
        return
    
    woj_code = d.state.teryt_code if d.state else "26"
    print(f"Dane z bazy: Powiat={d.name}, WojKod={woj_code}")

    # 2. Pobierz gminy z GUS
    print("\nZapytanie GUS: PobierzListeGmin(Woj={woj_code}, Pow=None)...")
    # Uwaga: Według diagnostyki sygnatura to Woj, Pow, DataStanu
    # Ale spróbujmy różnych wariantów
    client = teryt_ws._client()
    ds = client.service.PobierzDateAktualnegoKatTerc()
    
    # Próba A: PobierzListeGminPowiecie (często lepiej działa dla miast)
    try:
        print("Próba: PobierzListeGminPowiecie(Woj='26', Pow='09')...")
        res = client.service.PobierzListeGminPowiecie(Woj='26', Pow='09', DataStanu=ds)
        gminy = serialize_object(res)
        print(f"  Wynik Gminy: {len(gminy) if isinstance(gminy, list) else 'Nie-lista'}")
        if gminy:
            g = gminy[0] if isinstance(gminy, list) else gminy
            gmi_code = g.get('GMI')
            rodz_code = g.get('RODZ')
            print(f"  Przykładowa gmina: {g.get('NAZWA')} (GMI: {gmi_code}, RODZ: {rodz_code})")
            
            # 3. Pobierz miejscowości dla tej gminy
            print(f"\nZapytanie GUS: PobierzListeMiejscowosciWGminie(Woj='26', Pow='09', Gmi='{gmi_code}')...")
            # Sygnatura: Wojewodztwo, Powiat, Gmina
            m_res = client.service.PobierzListeMiejscowosciWGminie(
                Wojewodztwo='26', 
                Powiat='09', 
                Gmina=gmi_code, 
                DataStanu=ds
            )
            m_list = serialize_object(m_res)
            print(f"  Wynik Miejscowości: {type(m_list)}")
            if m_list:
                m_item = m_list[0] if isinstance(m_list, list) else m_list
                print(f"  Sukces! Znaleziono: {m_item.get('NAZWA')}")
            else:
                print("  FAIL: GUS zwrócił pusto dla miejscowości w tej gminie.")
    except Exception as e:
        print(f"  BŁĄD KROKU: {str(e)}")

    db.close()
    print("\n--- KONIEC AUDYTU ---")

if __name__ == "__main__":
    deep_audit()
