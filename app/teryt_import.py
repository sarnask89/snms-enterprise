"""Importer plików XML z rejestru TERYT (GUS). Wspiera TERC, SIMC, ULIC."""

from __future__ import annotations

import xml.etree.ElementTree as ET
from typing import BinaryIO

from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models


def _clean(val: str | None) -> str | None:
    if val is None: return None
    v = val.strip()
    return v if v else None


def import_terc_xml(db: Session, xml_file: BinaryIO) -> tuple[int, int]:
    """
    Importuje plik TERC (województwa, powiaty, gminy).
    """
    context = ET.iterparse(xml_file, events=("end",))
    s_count = 0
    d_count = 0
    
    states_data = {} # teryt_code -> name
    districts_data = [] # (woj_code, pow_code, name)
    
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
            
    # Zapisz województwa
    state_map = {} # teryt_code -> models.LocationState.id
    for t_code, name in states_data.items():
        state = db.scalars(select(models.LocationState).where(models.LocationState.teryt_code == t_code)).first()
        if not state:
            state = models.LocationState(name=name, teryt_code=t_code)
            db.add(state)
            db.flush()
            s_count += 1
        state_map[t_code] = state.id
        
    # Zapisz powiaty
    for woj_code, pow_code, name in districts_data:
        state_id = state_map.get(woj_code)
        if not state_id:
            # Może województwo już było w bazie wcześniej?
            state = db.scalars(select(models.LocationState).where(models.LocationState.teryt_code == woj_code)).first()
            if state:
                state_id = state.id
                state_map[woj_code] = state_id
            else:
                continue
        
        exist = db.scalars(select(models.LocationDistrict).where(
            (models.LocationDistrict.state_id == state_id) & 
            (models.LocationDistrict.teryt_code == pow_code)
        )).first()
        if not exist:
            db.add(models.LocationDistrict(state_id=state_id, name=name, teryt_code=pow_code))
            d_count += 1
            
    db.commit()
    return s_count, d_count


def import_simc_xml(db: Session, xml_file: BinaryIO) -> int:
    """
    Importuje plik SIMC (miejscowości).
    """
    context = ET.iterparse(xml_file, events=("end",))
    count = 0
    
    dist_cache = {}
    all_districts = db.query(models.LocationDistrict).join(models.LocationState).all()
    for d in all_districts:
        dist_cache[(d.state.teryt_code, d.teryt_code)] = d.id

    for _, elem in context:
        if elem.tag == "row":
            woj = _clean(elem.findtext('WOJ'))
            powiat = _clean(elem.findtext('POW'))
            gmi = _clean(elem.findtext('GMI'))
            rodz = _clean(elem.findtext('RODZ_GMI')) or _clean(elem.findtext('RODZ'))
            nazwa = _clean(elem.findtext('NAZWA'))
            sym = _clean(elem.findtext('SYM'))
            
            if all([woj, powiat, nazwa, sym]):
                dist_id = dist_cache.get((woj, powiat))
                if dist_id:
                    exist = db.scalars(select(models.LocationCity).where(models.LocationCity.teryt_code == sym)).first()
                    if not exist:
                        db.add(models.LocationCity(
                            district_id=dist_id,
                            name=nazwa,
                            teryt_code=sym,
                            commune_code=gmi,
                            commune_type=rodz
                        ))
                        count += 1
                        if count % 500 == 0:
                            db.flush()
            elem.clear()
                
    db.commit()
    return count


def import_ulic_xml(db: Session, xml_file: BinaryIO) -> int:
    """
    Importuje plik ULIC (ulice). Wykorzystuje iterparse dla oszczędności pamięci.
    """
    context = ET.iterparse(xml_file, events=("end",))
    count = 0
    
    # Cache miast (SIMC)
    city_cache = {} # sym -> city_id
    all_cities = db.query(models.LocationCity.id, models.LocationCity.teryt_code).all()
    for cid, sym in all_cities:
        if sym: city_cache[sym] = cid

    for _, elem in context:
        if elem.tag == "row":
            sym = _clean(elem.findtext('SYM')) # SIMC miasta
            cecha = _clean(elem.findtext('CECHA')) # np. ul., al., pl.
            nazwa1 = _clean(elem.findtext('NAZWA_1'))
            nazwa2 = _clean(elem.findtext('NAZWA_2')) or ""
            ulic = _clean(elem.findtext('SYM_UL')) # Kod ulicy
            
            if all([sym, nazwa1, ulic]):
                city_id = city_cache.get(sym)
                if city_id:
                    full_name = f"{cecha} {nazwa2} {nazwa1}".strip().replace("  ", " ")
                    
                    # Sprawdzamy po ULIC w obrębie miasta
                    exist = db.scalars(select(models.LocationStreet).where(
                        (models.LocationStreet.city_id == city_id) & 
                        (models.LocationStreet.teryt_code == ulic)
                    )).first()
                    
                    if not exist:
                        db.add(models.LocationStreet(
                            city_id=city_id,
                            name=full_name,
                            teryt_code=ulic
                        ))
                        count += 1
                        if count % 1000 == 0:
                            db.flush()
            elem.clear()
                
    db.commit()
    return count
