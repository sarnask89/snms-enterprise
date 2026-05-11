import pytest
from io import BytesIO
from unittest.mock import MagicMock
from app.teryt_import import _clean, import_terc_xml
from app import models

def test_clean():
    assert _clean("  text  ") == "text"
    assert _clean("") is None
    assert _clean(None) is None

def test_import_terc_xml():
    db = MagicMock()
    # Mock database checks to return None (not exists)
    db.scalars.return_value.first.return_value = None
    
    # Minimal TERC XML
    xml_content = """<?xml version="1.0" encoding="utf-8"?>
    <teryt>
        <row>
            <WOJ>02</WOJ>
            <POW></POW>
            <GMI></GMI>
            <NAZWA>DOLNOSLASKIE</NAZWA>
        </row>
        <row>
            <WOJ>02</WOJ>
            <POW>01</POW>
            <GMI></GMI>
            <NAZWA>boleslawiecki</NAZWA>
        </row>
    </teryt>
    """.encode("utf-8")
    s_count, d_count = import_terc_xml(db, BytesIO(xml_content))
    
    assert s_count == 1
    assert db.add.called
    assert db.commit.called
