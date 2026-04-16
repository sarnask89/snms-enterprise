from fastapi import APIRouter, Depends, File, Form, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.config import UPLOAD_ROOT
from app.database import get_db
from app.deps import require_business_write, verify_session
from app.storage import delete_stored_file, save_document_upload
from app.templating import render

router = APIRouter(prefix="/documents", dependencies=[Depends(verify_session)])


@router.get("", response_class=HTMLResponse)
def document_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.Document).order_by(models.Document.id.desc())).all())
    customers = {c.id: c for c in db.scalars(select(models.Customer)).all()}
    return render(
        request,
        "documents/list.html",
        {
            "title": "Dokumenty",
            "documents": rows,
            "customers": customers,
        },
    )


@router.get("/new", response_class=HTMLResponse)
def document_new_form(request: Request, db: Session = Depends(get_db)):
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    return render(
        request,
        "documents/form.html",
        {"title": "Nowy dokument", "customers": custs},
    )


@router.post("/new", dependencies=[Depends(require_business_write)])
def document_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    title: str = Form(...),
    doc_type: str = Form("other"),
    customer_id: int | None = Form(None),
    notes: str | None = Form(None),
    file: UploadFile | None = File(None),
):
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    stored_path = None
    original_filename = None
    mime_type = None
    file_size = None
    if file and file.filename and str(file.filename).strip():
        try:
            stored_path, original_filename, file_size, mime_type = save_document_upload(file)
        except ValueError as e:
            return render(
                request,
                "documents/form.html",
                {
                    "title": "Nowy dokument",
                    "customers": custs,
                    "error": str(e),
                },
                status_code=400,
            )
    d = models.Document(
        title=title.strip(),
        doc_type=doc_type.strip() or "other",
        customer_id=customer_id or None,
        notes=(notes or None) and notes.strip() or None,
        stored_path=stored_path,
        original_filename=original_filename,
        mime_type=mime_type,
        file_size=file_size,
    )
    db.add(d)
    db.commit()
    return RedirectResponse("/documents", status_code=303)


@router.get("/{doc_id}/download")
def document_download(doc_id: int, db: Session = Depends(get_db)):
    d = db.get(models.Document, doc_id)
    if not d or not d.stored_path:
        return RedirectResponse("/documents", status_code=302)
    path = (UPLOAD_ROOT / d.stored_path).resolve()
    root = UPLOAD_ROOT.resolve()
    try:
        path.relative_to(root)
    except ValueError:
        return RedirectResponse("/documents", status_code=302)
    if not path.is_file():
        return RedirectResponse("/documents", status_code=302)
    name = d.original_filename or path.name
    return FileResponse(
        path,
        filename=name,
        media_type=d.mime_type or "application/octet-stream",
    )


@router.post("/{doc_id}/delete", dependencies=[Depends(require_business_write)])
def document_delete(doc_id: int, db: Session = Depends(get_db)):
    d = db.get(models.Document, doc_id)
    if d:
        delete_stored_file(d.stored_path)
        db.delete(d)
        db.commit()
    return RedirectResponse("/documents", status_code=303)
