"""开发环境下的初始化脚本，用于插入示例航线数据。"""
from __future__ import annotations

from .session import Base, SessionLocal, engine
from ..models.flight import FlightRoute

SAMPLE_ROUTES = [
    {
        "departure_city": "北京",
        "destination_city": "上海",
        "daily_flight_count": 30,
        "longitude_departure": 116.4074,
        "latitude_departure": 39.9042,
        "longitude_destination": 121.4737,
        "latitude_destination": 31.2304,
    },
    {
        "departure_city": "北京",
        "destination_city": "广州",
        "daily_flight_count": 20,
        "longitude_departure": 116.4074,
        "latitude_departure": 39.9042,
        "longitude_destination": 113.2644,
        "latitude_destination": 23.1291,
    },
    {
        "departure_city": "上海",
        "destination_city": "伦敦",
        "daily_flight_count": 8,
        "longitude_departure": 121.4737,
        "latitude_departure": 31.2304,
        "longitude_destination": -0.1276,
        "latitude_destination": 51.5072,
    },
]


def init_db() -> None:
    """创建数据库表并插入示例数据。"""
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        if session.query(FlightRoute).count() == 0:
            for item in SAMPLE_ROUTES:
                session.add(FlightRoute(**item))
            session.commit()
    finally:
        session.close()


if __name__ == "__main__":
    init_db()
