"""FastAPI 路由定义模块。"""
from __future__ import annotations

from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from ..db.session import get_session
from ..models.flight import FlightRoute
from ..schemas.flight import FlightRouteCreate, FlightRouteFilter, FlightRouteRead
from ..services import flight_importer

router = APIRouter(prefix="/api", tags=["航线数据接口"])


@router.get("/routes", response_model=List[FlightRouteRead], summary="获取所有航线")
def list_routes(
    filter: FlightRouteFilter = Depends(),
    session: Session = Depends(get_session),
) -> List[FlightRouteRead]:
    """根据筛选条件返回航线列表。"""
    query = session.query(FlightRoute)
    if filter.departure_city:
        query = query.filter(FlightRoute.departure_city == filter.departure_city)
    if filter.destination_city:
        query = query.filter(FlightRoute.destination_city == filter.destination_city)
    if filter.min_daily_flight_count is not None:
        query = query.filter(FlightRoute.daily_flight_count >= filter.min_daily_flight_count)
    routes = query.order_by(FlightRoute.daily_flight_count.desc()).all()
    return routes


@router.post("/routes", response_model=FlightRouteRead, summary="新增单条航线")
def create_route(
    payload: FlightRouteCreate,
    session: Session = Depends(get_session),
) -> FlightRouteRead:
    """创建一条新的航线记录。"""
    route = FlightRoute(**payload.dict())
    session.add(route)
    session.commit()
    session.refresh(route)
    return route


@router.post(
    "/routes/import",
    summary="批量导入航线数据",
    description="支持上传 CSV 或 JSON 文件，字段需符合航线数据结构。",
)
def import_routes(
    file: UploadFile,
    session: Session = Depends(get_session),
) -> JSONResponse:
    """上传文件后自动根据格式导入航线数据。"""
    suffix = Path(file.filename).suffix.lower()
    temp_path = Path("/tmp") / file.filename
    content = file.file.read()
    temp_path.write_bytes(content)

    if suffix == ".csv":
        count = flight_importer.import_from_csv(session, temp_path)
    elif suffix == ".json":
        count = flight_importer.import_from_json(session, temp_path)
    else:
        raise HTTPException(status_code=400, detail="目前仅支持 CSV/JSON 文件。")

    temp_path.unlink(missing_ok=True)
    return JSONResponse({"message": "导入成功", "count": count})


@router.get("/cities", summary="获取全部城市列表")
def list_cities(session: Session = Depends(get_session)) -> JSONResponse:
    """返回数据库中涉及的出发地与目的地城市集合。"""
    departures = session.query(FlightRoute.departure_city).distinct().all()
    destinations = session.query(FlightRoute.destination_city).distinct().all()
    departure_cities = {item[0] for item in departures}
    destination_cities = {item[0] for item in destinations}
    return JSONResponse(
        {
            "departure_cities": sorted(departure_cities),
            "destination_cities": sorted(destination_cities),
        }
    )


@router.get(
    "/search",
    response_model=List[FlightRouteRead],
    summary="按出发地/目的地搜索航线",
)
def search_routes(
    departure_city: Optional[str] = None,
    destination_city: Optional[str] = None,
    session: Session = Depends(get_session),
) -> List[FlightRouteRead]:
    """根据输入的出发地或目的地模糊搜索航线。"""
    query = session.query(FlightRoute)
    if departure_city:
        query = query.filter(FlightRoute.departure_city.ilike(f"%{departure_city}%"))
    if destination_city:
        query = query.filter(FlightRoute.destination_city.ilike(f"%{destination_city}%"))
    return query.order_by(FlightRoute.daily_flight_count.desc()).all()
