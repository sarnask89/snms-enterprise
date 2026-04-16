"""Zapis plikow przesylanych (dokumenty / skany)."""

from __future__ import annotations

import re
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.config import MAX_UPLOAD_BYTES, UPLOAD_ROOT

ALLOWED_DOC_SUFFIXES = frozenset(
    {".pdf", ".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff", ".txt", ".doc", ".docx"}
)


def _safe_suffix(filename: str | None) -> str:
    if not filename:
        return ""
    suf = Path(filename).suffix.lower()
    if len(suf) > 12:
        suf = suf[:12]
    return suf if suf in ALLOWED_DOC_SUFFIXES else ""


def save_document_upload(upload: UploadFile) -> tuple[str, str, int, str | None]:
    """
    Zapisuje plik pod UPLOAD_ROOT/documents/<uuid>.ext
    Zwraca: (relative_path, original_name, size, mime_type)
    """
    suffix = _safe_suffix(upload.filename)
    if not suffix:
        raise ValueError("Niedozwolony lub brak rozszerzenia pliku.")
    rel = f"documents/{uuid.uuid4().hex}{suffix}"
    dest = UPLOAD_ROOT / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    raw = upload.file.read()
    if len(raw) > MAX_UPLOAD_BYTES:
        raise ValueError("Plik za duzy.")
    dest.write_bytes(raw)
    orig = upload.filename or dest.name
    orig = re.sub(r"[^\w.\- +]", "_", orig)[:200]
    return rel, orig, len(raw), upload.content_type


def delete_stored_file(relative_path: str | None) -> None:
    if not relative_path:
        return
    p = UPLOAD_ROOT / relative_path
    try:
        if p.is_file():
            p.unlink()
    except OSError:
        pass
