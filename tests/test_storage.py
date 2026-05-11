import pytest
from unittest.mock import MagicMock
from pathlib import Path
from app.storage import _safe_suffix, save_document_upload, delete_stored_file
from fastapi import UploadFile
import io

def test_safe_suffix():
    assert _safe_suffix("test.pdf") == ".pdf"
    assert _safe_suffix("image.PNG") == ".png"
    assert _safe_suffix("malicious.exe") == ""
    assert _safe_suffix("noextension") == ""
    assert _safe_suffix(None) == ""

def test_save_document_upload_success(tmp_path):
    upload = MagicMock(spec=UploadFile)
    upload.filename = "test.pdf"
    upload.content_type = "application/pdf"
    upload.file = io.BytesIO(b"dummy pdf content")
    
    with pytest.MonkeyPatch.context() as mp:
        mp.setattr("app.storage.UPLOAD_ROOT", tmp_path)
        rel, orig, size, mime = save_document_upload(upload)
        
        assert rel.startswith("documents/")
        assert rel.endswith(".pdf")
        assert orig == "test.pdf"
        assert size == 17
        assert mime == "application/pdf"
        assert (tmp_path / rel).exists()

def test_save_document_upload_too_large():
    upload = MagicMock(spec=UploadFile)
    upload.filename = "test.pdf"
    upload.file = io.BytesIO(b"large content")
    
    with pytest.MonkeyPatch.context() as mp:
        mp.setattr("app.storage.MAX_UPLOAD_BYTES", 5)
        with pytest.raises(ValueError, match="Plik za duzy"):
            save_document_upload(upload)

def test_delete_stored_file(tmp_path):
    file_path = tmp_path / "test.txt"
    file_path.write_text("hello")
    assert file_path.exists()
    
    with pytest.MonkeyPatch.context() as mp:
        mp.setattr("app.storage.UPLOAD_ROOT", tmp_path)
        delete_stored_file("test.txt")
        assert not file_path.exists()

def test_delete_stored_file_nonexistent(tmp_path):
    with pytest.MonkeyPatch.context() as mp:
        mp.setattr("app.storage.UPLOAD_ROOT", tmp_path)
        # Should not raise exception
        delete_stored_file("nonexistent.txt")
