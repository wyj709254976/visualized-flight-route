"""航班航线 ORM 模型定义。"""
from __future__ import annotations

from sqlalchemy import Column, Float, Integer, String

from ..db.session import Base


class FlightRoute(Base):
    """航线数据模型，对应数据库中的 flights 表。"""

    __tablename__ = "flights"

    id = Column(Integer, primary_key=True, index=True)
    departure_city = Column(String(64), nullable=False, index=True)
    destination_city = Column(String(64), nullable=False, index=True)
    daily_flight_count = Column(Integer, nullable=False, default=0)
    longitude_departure = Column(Float, nullable=False)
    latitude_departure = Column(Float, nullable=False)
    longitude_destination = Column(Float, nullable=False)
    latitude_destination = Column(Float, nullable=False)
