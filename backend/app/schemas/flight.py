"""航线相关的 Pydantic 模型定义。"""
from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class FlightRouteBase(BaseModel):
    """航线公共字段定义。"""

    departure_city: str = Field(..., description="出发城市名称")
    destination_city: str = Field(..., description="目的城市名称")
    daily_flight_count: int = Field(..., ge=0, description="每日航班数量")
    longitude_departure: float = Field(..., description="出发城市经度")
    latitude_departure: float = Field(..., description="出发城市纬度")
    longitude_destination: float = Field(..., description="到达城市经度")
    latitude_destination: float = Field(..., description="到达城市纬度")


class FlightRouteCreate(FlightRouteBase):
    """创建航线时的请求体模型。"""

    pass


class FlightRouteRead(FlightRouteBase):
    """返回给前端的航线数据模型。"""

    id: int = Field(..., description="航线唯一标识")

    class Config:
        orm_mode = True


class FlightRouteFilter(BaseModel):
    """航线筛选条件模型。"""

    departure_city: Optional[str] = Field(None, description="筛选出发城市")
    destination_city: Optional[str] = Field(None, description="筛选目的城市")
    min_daily_flight_count: Optional[int] = Field(None, ge=0, description="最小航班数量阈值")
