"""Generowanie numerów dokumentów wg planu numeracji (SNMS)."""

from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from app import models


def allocate_next_document_number(db: Session, plan: models.NumberPlan) -> str:
    """
    Zwraca kolejny numer i zwiększa licznik planu.
    Wzorzec: placeholdery {year} (4 cyfry) i {n} (numer, domyślnie 4 cyfry w szablonie).
    """
    y = date.today().year
    n = max(1, int(plan.next_number or 1))
    tpl = (plan.pattern_template or "FV/{year}/{n}").strip()
    try:
        rendered = tpl.format(year=y, n=f"{n:04d}")
    except (KeyError, ValueError):
        rendered = f"{tpl}-{y}-{n:04d}"
    plan.next_number = n + 1
    db.add(plan)
    db.flush()
    return rendered[:64]
