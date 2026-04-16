import os
import sys
from sqlalchemy import select

# Dodaj bieżący katalog do path
sys.path.insert(0, os.getcwd())

from app.database import SessionLocal
from app import models, teryt_ws

def sync_by_pattern(db, name_pattern):
    districts = db.query(models.LocationDistrict).filter(models.LocationDistrict.name.ilike(f"%{name_pattern}%")).all()
    for d in districts:
        if not d.state or not d.state.teryt_code: continue
        woj_code = d.state.teryt_code
        
        # Pobierz kod powiatu z GUS
        p_items, _ = teryt_ws.powiaty_as_serializable(woj_code)
        pow_code = None
        for p in p_items:
            # GUS używa nazw wielkimi literami, np. 'M.ST. WARSZAWA' lub 'POWIAT WARSZAWSKI ZACHODNI'
            if name_pattern.upper() in p.get('NAZWA', ''):
                pow_code = p.get('POW')
                print(f"Znalazłem kod GUS dla {d.name}: {pow_code} (Nazwa w GUS: {p.get('NAZWA')})")
                
                m_items, _ = teryt_ws.miejscowości_as_serializable(woj_code, pow_code)
                count = 0
                for m in m_items:
                    m_name = m.get('Nazwa') or m.get('NAZWA')
                    if not m_name: continue
                    exist = db.query(models.LocationCity).filter(
                        models.LocationCity.district_id == d.id,
                        models.LocationCity.name == str(m_name)
                    ).first()
                    if not exist:
                        db.add(models.LocationCity(district_id=d.id, name=str(m_name)))
                        count += 1
                db.commit()
                print(f"  Dodano {count} miejscowości do {d.name}.")
                break

def run():
    db = SessionLocal()
    sync_by_pattern(db, "Warszawa")
    sync_by_pattern(db, "Kraków")
    sync_by_pattern(db, "Wrocław")
    db.close()

if __name__ == "__main__":
    run()
