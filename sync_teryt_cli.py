import os
import sys
from sqlalchemy import select

# Dodaj bieżący katalog do path
sys.path.insert(0, os.getcwd())

from app.database import SessionLocal
from app import models, teryt_ws

def run_sync(limit_states=None):
    db = SessionLocal()
    print("Rozpoczynam pełną synchronizację TERYT (Województwa -> Powiaty -> Miasta)...")
    try:
        # 1. Województwa
        items, _ = teryt_ws.wojewodztwa_as_serializable()
        
        for it in items[:limit_states] if limit_states else items:
            name = it.get('NAZWA') or it.get('Nazwa')
            t_code = it.get('WOJ') or it.get('Woj')
            if not name or not t_code: continue

            name = str(name).capitalize()
            state = db.query(models.LocationState).filter_by(teryt_code=str(t_code)).first()
            if not state:
                print(f"Dodaję województwo: {name}")
                state = models.LocationState(name=name, teryt_code=str(t_code))
                db.add(state)
                db.flush()

            # 2. Powiaty
            p_items, _ = teryt_ws.powiaty_as_serializable(str(t_code))
            for pit in p_items:
                p_name = pit.get('NAZWA') or pit.get('Nazwa')
                p_code = pit.get('POW') or pit.get('Pow')
                if not p_name: continue
                
                district = db.query(models.LocationDistrict).filter_by(
                    state_id=state.id, name=str(p_name)
                ).first()
                if not district:
                    print(f"  + Powiat: {p_name}")
                    district = models.LocationDistrict(state_id=state.id, name=str(p_name), teryt_code=str(p_code))
                    db.add(district)
                    db.flush()

                # 3. Gminy (by pobrać miasta)
                # TERYT ws1: PobierzListeMiejscowosciWGminie wymaga Gmi i Rodz
                g_items, _ = teryt_ws.gminy_as_serializable(str(t_code), str(p_code))
                for git in g_items:
                    g_code = git.get('GMI') or git.get('Gmina')
                    g_type = git.get('RODZ') or git.get('Rodzaj')
                    if not g_code: continue

                    # 4. Miejscowości
                    m_items, _ = teryt_ws.miejscowości_as_serializable(str(t_code), str(p_code), str(g_code))
                    for mit in m_items:
                        m_name = mit.get('Nazwa') or mit.get('NAZWA')
                        m_simc = mit.get('Symbol') or mit.get('SYM')
                        if not m_name: continue

                        city = db.query(models.LocationCity).filter_by(
                            district_id=district.id, name=str(m_name)
                        ).first()
                        if not city:
                            print(f"    - Miasto: {m_name} (SIMC: {m_simc})")
                            city = models.LocationCity(
                                district_id=district.id, 
                                name=str(m_name), 
                                teryt_code=str(m_simc),
                                commune_code=str(g_code),
                                commune_type=str(g_type)
                            )
                            db.add(city)
            
            db.commit() # Commit per state to save progress
        
        print("Synchronizacja zakończona.")
    except Exception as e:
        db.rollback()
        print(f"BŁĄD: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    # Limit to 1 state for testing if needed: run_sync(limit_states=1)
    run_sync()
