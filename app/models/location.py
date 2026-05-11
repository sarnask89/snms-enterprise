from __future__ import annotations
from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class LocationState(Base):
    __tablename__ = "location_states"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    teryt_code: Mapped[str | None] = mapped_column(String(16), nullable=True, unique=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    districts: Mapped[list["LocationDistrict"]] = relationship(back_populates="state")

class LocationDistrict(Base):
    __tablename__ = "location_districts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    state_id: Mapped[int] = mapped_column(ForeignKey("location_states.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    teryt_code: Mapped[str | None] = mapped_column(String(16), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    state: Mapped["LocationState"] = relationship(back_populates="districts")
    cities: Mapped[list["LocationCity"]] = relationship(back_populates="district")

class LocationCity(Base):
    __tablename__ = "location_cities"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    district_id: Mapped[int] = mapped_column(ForeignKey("location_districts.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    teryt_code: Mapped[str | None] = mapped_column(String(16), nullable=True)
    commune_code: Mapped[str | None] = mapped_column(String(8), nullable=True)
    commune_type: Mapped[str | None] = mapped_column(String(4), nullable=True)
    is_managed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    district: Mapped["LocationDistrict"] = relationship(back_populates="cities")
    streets: Mapped[list["LocationStreet"]] = relationship(back_populates="city", cascade="all, delete-orphan")

class LocationStreet(Base):
    __tablename__ = "location_streets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    city_id: Mapped[int] = mapped_column(ForeignKey("location_cities.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    teryt_code: Mapped[str | None] = mapped_column(String(16), nullable=True)
    city: Mapped["LocationCity"] = relationship(back_populates="streets")
