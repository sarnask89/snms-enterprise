"""Generowanie numerów dokumentów wg planu numeracji (SNMS)."""

from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from app import models


def allocate_next_document_number(db: Session, plan: models.NumberPlan) -> str:
    """
    Zwraca kolejny numer i zwiększa licznik planu.
    Wzorzec: placeholdery {year} (4 cyfry) i {n} (numer).
    Obsługuje wzorce bez obu placeholderów, używając tylko dostępnych.
    """
    y = date.today().year
    n = max(1, int(plan.next_number or 1))
    tpl = (plan.pattern_template or "{year}/{n}").strip()
    
    # Przygotuj dane do formatowania
    fmt_data = {
        "year": str(y),
        "n": f"{n:04d}" # Domyślnie 4 cyfry
    }
    
    # Sprytne formatowanie: usuń nieobecne klucze z tpl jeśli format() by rzucił KeyError
    # Ale format() rzuca KeyError tylko gdy w tpl SĄ klamry których nie ma w fmt_data.
    # Jeśli w fmt_data są klucze których nie ma w tpl, jest ok.
    try:
        rendered = tpl.format(**fmt_data)
    except (KeyError, ValueError) as e:
        # Fallback jeśli formatowanie zawiedzie
        rendered = f"{tpl}-{y}-{n:04d}"
        
    plan.next_number = n + 1
    db.add(plan)
    db.flush()
    return rendered[:64]
