"""Klient SOAP dla usługi TERYT ws1 (GUS). Zoptymalizowany pod wyszukiwanie online (Search-on-Demand)."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from zeep import Client
from zeep.helpers import serialize_object
from zeep.wsse.username import UsernameToken

from app.config import TERYT_WS_PASSWORD, TERYT_WS_USER, TERYT_WS_WSDL


class TerytWsConfigError(RuntimeError):
    pass


def _client() -> Client:
    if not TERYT_WS_USER or not TERYT_WS_PASSWORD:
        raise TerytWsConfigError("Brak poświadczeń TERYT.")
    return Client(
        TERYT_WS_WSDL,
        wsse=UsernameToken(TERYT_WS_USER, TERYT_WS_PASSWORD),
    )


def czy_zalogowany() -> bool:
    client = _client()
    try:
        return bool(client.service.CzyZalogowany())
    except Exception:
        return False


def _extract_list(res: Any, key: str | None = None) -> list[Any]:
    """Pomocnik do wyciągania listy z odpowiedzi zeep/serialize_object."""
    if not res:
        return []
    
    # Jeśli to już jest lista, zwróć ją
    if isinstance(res, list):
        return res
    
    # Jeśli to słownik, szukaj klucza lub wróć pustą listę
    if isinstance(res, dict):
        if key and key in res:
            items = res[key]
            return items if isinstance(items, list) else [items]
        # Próba zgadywania jeśli klucza nie podano (np. JednostkaTerytorialna, Miejscowosc)
        for k in ['JednostkaTerytorialna', 'Miejscowosc', 'Ulica']:
            if k in res:
                items = res[k]
                return items if isinstance(items, list) else [items]
        # Jeśli nic nie pasuje, ale są inne klucze, może to być pojedynczy obiekt?
        # Ale zazwyczaj GUS zwraca listę lub słownik z listą pod konkretnym kluczem.
    
    return []


def wyszukaj_miejscowosc(nazwa: str) -> list[Any]:
    """Wyszukuje miejscowości po fragmencie nazwy bezpośrednio w GUS."""
    client = _client()
    try:
        raw = client.service.WyszukajMiejscowosc(nazwaMiejscowosci=nazwa)
        res = serialize_object(raw)
        return _extract_list(res, 'Miejscowosc')
    except Exception:
        return []


def wyszukaj_ulice(nazwa_ulicy: str, nazwa_miejscowosci: str) -> list[Any]:
    """Wyszukuje ulice online w GUS."""
    client = _client()
    try:
        raw = client.service.WyszukajUlice(
            nazwaUlicy=nazwa_ulicy, 
            nazwaMiejscowosci=nazwa_miejscowosci
        )
        res = serialize_object(raw)
        return _extract_list(res, 'Ulica')
    except Exception:
        return []


def wojewodztwa_as_serializable() -> list[Any]:
    client = _client()
    try:
        ds = client.service.PobierzDateAktualnegoKatTerc()
        raw = client.service.PobierzListeWojewodztw(DataStanu=ds)
        res = serialize_object(raw)
        return _extract_list(res, 'JednostkaTerytorialna')
    except Exception: return []



def powiaty_as_serializable(woj_id: str) -> list[Any]:
    client = _client()
    try:
        ds = client.service.PobierzDateAktualnegoKatTerc()
        raw = client.service.PobierzListePowiatow(Woj=woj_id, DataStanu=ds)
        res = serialize_object(raw)
        return _extract_list(res, 'JednostkaTerytorialna')
    except Exception: return []



from sqlalchemy.orm import Session
from sqlalchemy import select
from app import models

class TerytSearchService:
    """Service for searching TERYT address data (local and WS)."""
    
    def __init__(self, db: Session | None = None):
        self.db = db

    def search_cities(self, query: str) -> list[dict[str, Any]]:
        if not self.db: return []
        term = f"%{query.strip()}%"
        stmt = select(models.LocationCity).where(models.LocationCity.name.ilike(term)).limit(20)
        rows = self.db.scalars(stmt).all()
        return [{"id": r.id, "text": r.name, "type": "city", "teryt_code": r.teryt_code} for r in rows]

    def search_streets(self, city_id: int, query: str) -> list[dict[str, Any]]:
        if not self.db: return []
        term = f"%{query.strip()}%"
        stmt = select(models.LocationStreet).where(
            models.LocationStreet.city_id == city_id,
            models.LocationStreet.name.ilike(term)
        ).limit(20)
        rows = self.db.scalars(stmt).all()
        return [{"id": r.id, "text": r.name, "type": "street", "teryt_code": r.teryt_code} for r in rows]

    def search_buildings(self, city_name: str, street_name: str) -> list[str]:
        """Placeholder for building search logic."""
        # For now, return some dummy data to satisfy the UI
        return ["1", "2", "3", "4", "5", "6", "10", "12", "14"]


def gminy_as_serializable(woj_id: str, pow_id: str) -> list[Any]:
    client = _client()
    try:
        ds = client.service.PobierzDateAktualnegoKatTerc()
        raw = client.service.PobierzListeGminPowiecie(Woj=woj_id, Pow=pow_id, DataStanu=ds)
        res = serialize_object(raw)
        return _extract_list(res, 'JednostkaTerytorialna')
    except Exception: return []


def miejscowości_as_serializable(woj_id: str, pow_id: str, gmi_id: str) -> list[Any]:
    client = _client()
    try:
        ds = client.service.PobierzDateAktualnegoKatTerc()
        raw = client.service.PobierzListeMiejscowosciWGminie(
            Wojewodztwo=woj_id, Powiat=pow_id, Gmina=gmi_id, DataStanu=ds
        )
        res = serialize_object(raw)
        return _extract_list(res, 'Miejscowosc')
    except Exception: return []


def _get_file_content(res: Any) -> bytes | None:
    """Wyciąga zawartość pliku z obiektu odpowiedzi GUS."""
    if not res:
        return None
    # Atrybuty mogą się nazywać plikZawartosc lub PlikZawartosc (zeep czasem zmienia wielkość liter)
    for attr in ['plikZawartosc', 'PlikZawartosc', 'zawartosc', 'Zawartosc']:
        if hasattr(res, attr):
            return getattr(res, attr)
    return None


def pobierz_pelny_terc_zip() -> bytes | None:
    """Pobiera pełny katalog TERC (województwa, powiaty, gminy) w formacie ZIP."""
    client = _client()
    try:
        ds = client.service.PobierzDateAktualnegoKatTerc()
        res = client.service.PobierzKatalogTERC(DataStanu=ds)
        return _get_file_content(res)
    except Exception: return None


def pobierz_pelny_simc_zip() -> bytes | None:
    """Pobiera pełny katalog SIMC (miejscowości) w formacie ZIP."""
    client = _client()
    try:
        ds = client.service.PobierzDateAktualnegoKatSimc()
        res = client.service.PobierzKatalogSIMC(DataStanu=ds)
        return _get_file_content(res)
    except Exception: return None


def pobierz_pelny_ulic_zip() -> bytes | None:
    """Pobiera pełny katalog ULIC (ulice) w formacie ZIP."""
    client = _client()
    try:
        ds = client.service.PobierzDateAktualnegoKatUlic()
        res = client.service.PobierzKatalogULIC(DataStanu=ds)
        return _get_file_content(res)
    except Exception: return None
