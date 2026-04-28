"""Generowanie numerów dokumentów wg planu numeracji (SNMS)."""

from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from app import models


def allocate_next_document_number(db: Session, plan: models.NumberPlan) -> str:
    """
    Zwraca kolejny numer i zwiększa licznik planu.
    Wzorzec: {year}, {month}, {day}, {n} (liczba).
    """
    today = date.today()
    n = max(1, int(plan.next_number or 1))
    tpl = (plan.pattern_template or "{year}/{n}").strip()
    
    fmt_data = {
        "year": today.year,
        "month": f"{today.month:02d}",
        "day": f"{today.day:02d}",
        "n": n
    }
    
    # Próba formatowania. Jeśli w tpl jest samo {n}, zadziała domyślne str(n).
    # Jeśli jest {n:04d}, zadziała padding.
    try:
        # Jeśli tpl nie ma jawnego formatu dla n, wymuś 4 cyfry dla kompatybilności wstecznej
        # ale tylko jeśli użytkownik nie użył klamerek z formatowaniem.
        if "{n}" in tpl and "{n:" not in tpl:
            rendered = tpl.replace("{n}", f"{n:04d}").format(**fmt_data)
        else:
            rendered = tpl.format(**fmt_data)
    except (KeyError, ValueError):
        rendered = f"{tpl}-{today.year}-{n:04d}"
        
    plan.next_number = n + 1
    db.add(plan)
    db.flush()
    return rendered[:64]
