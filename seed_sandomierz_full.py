import os
import sys
sys.path.insert(0, os.getcwd())
from app.database import SessionLocal
from app import models

def ensure_sandomierz():
    db = SessionLocal()
    try:
        # 1. Województwo
        state = db.query(models.LocationState).filter_by(teryt_code='26').first()
        if not state:
            state = models.LocationState(name='Świętokrzyskie', teryt_code='26')
            db.add(state); db.flush()
        
        # 2. Powiat
        district = db.query(models.LocationDistrict).filter_by(state_id=state.id, teryt_code='09').first()
        if not district:
            district = models.LocationDistrict(state_id=state.id, name='sandomierski', teryt_code='09')
            db.add(district); db.flush()
            
        # 3. Miasto
        city = db.query(models.LocationCity).filter_by(district_id=district.id, teryt_code='0980670').first()
        if not city:
            city = models.LocationCity(
                district_id=district.id, 
                name='Sandomierz', 
                teryt_code='0980670',
                commune_code='01',
                commune_type='1'
            )
            db.add(city)
        
        db.commit()
        print(f"Baza gotowa do testu. ID Miasta Sandomierz: {city.id if city else '?'}")
    finally:
        db.close()

if __name__ == "__main__":
    ensure_sandomierz()
