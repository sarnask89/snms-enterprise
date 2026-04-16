import os
import sys
# Dodaj bieżący katalog do path
sys.path.insert(0, os.getcwd())

from app.database import SessionLocal
from app import models

def inject_data():
    db = SessionLocal()
    print("Wstrzykuję dane testowe dla miast i powiatów...")
    
    # 1. Mazowieckie (id 1 w Twojej bazie to Mazowieckie z kodem 14)
    # Warszawa jest już częściowo obecna, upewnijmy się
    waw = db.query(models.LocationDistrict).filter(models.LocationDistrict.name == "powiat Warszawa").first()
    if not waw:
        waw = models.LocationDistrict(state_id=1, name="powiat Warszawa")
        db.add(waw)
        db.flush()
    
    cities = ["Warszawa", "Legionowo", "Piaseczno", "Pruszków", "Otwock"]
    for cname in cities:
        if not db.query(models.LocationCity).filter(models.LocationCity.name == cname).first():
            db.add(models.LocationCity(district_id=waw.id, name=cname))
            print(f"Dodano miasto: {cname}")

    # 2. Małopolskie (prawdopodobnie id 11 po mojej poprzedniej synchronizacji)
    malopolska = db.query(models.LocationState).filter(models.LocationState.name == "Małopolskie").first()
    if malopolska:
        krk_pow = db.query(models.LocationDistrict).filter(models.LocationDistrict.name == "powiat krakowski").first()
        if not krk_pow:
            krk_pow = models.LocationDistrict(state_id=malopolska.id, name="powiat krakowski")
            db.add(krk_pow)
            db.flush()
        
        m_krk = ["Kraków", "Skawina", "Krzeszowice", "Słomniki"]
        for cname in m_krk:
            if not db.query(models.LocationCity).filter(models.LocationCity.name == cname).first():
                db.add(models.LocationCity(district_id=krk_pow.id, name=cname))
                print(f"Dodano miasto: {cname}")

    db.commit()
    print("Gotowe.")
    db.close()

if __name__ == "__main__":
    inject_data()
