import pytest
import logging
import os
from unittest.mock import patch, MagicMock
from app.init_db import validate_local_teryt_data
from app import models

def test_validate_local_teryt_data_missing(session):
    """Verify warning if TERYT tables are empty."""
    session.query(models.LocationStreet).delete()
    session.query(models.LocationCity).delete()
    session.query(models.LocationDistrict).delete()
    session.query(models.LocationState).delete()
    session.commit()

    # Clear TESTING env var so healthcheck runs
    with patch.dict(os.environ, {"TESTING": ""}):
        with patch("app.init_db.SessionLocal", return_value=session):
            with patch("app.init_db.logger") as mock_log:
                validate_local_teryt_data()
                mock_log.warning.assert_called_with("Local TERYT data is MISSING or incomplete. Run TERYT sync to populate.")

def test_validate_local_teryt_data_present(session):
    """Verify info log if TERYT data is present."""
    # Ensure data is present
    if session.query(models.LocationCity).count() == 0:
        state = models.LocationState(name="Test-State", teryt_code="99")
        session.add(state)
        session.flush()
        dist = models.LocationDistrict(name="Test-Dist", state_id=state.id, teryt_code="9901")
        session.add(dist)
        session.flush()
        city = models.LocationCity(name="Test-City", district_id=dist.id, teryt_code="99011")
        session.add(city)
        session.commit()

    with patch.dict(os.environ, {"TESTING": ""}):
        with patch("app.init_db.SessionLocal", return_value=session):
            with patch("app.init_db.logger") as mock_log:
                validate_local_teryt_data()
                
                found = False
                for call in mock_log.info.call_args_list:
                    if "Local TERYT data: OK" in str(call.args[0]):
                        found = True
                        break
                assert found, f"Expected OK log not found. Logs: {mock_log.info.call_args_list}"
