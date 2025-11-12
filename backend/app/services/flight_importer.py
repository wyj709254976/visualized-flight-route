"""航线数据导入服务，支持从 CSV/JSON 文件批量导入。"""
from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Iterable, List

from sqlalchemy.orm import Session

from ..models.flight import FlightRoute
from ..schemas.flight import FlightRouteCreate


def _bulk_create(session: Session, items: Iterable[FlightRouteCreate]) -> int:
    """内部工具：将航线数据批量写入数据库。"""
    routes: List[FlightRoute] = [FlightRoute(**item.dict()) for item in items]
    session.bulk_save_objects(routes)
    session.commit()
    return len(routes)


def import_from_csv(session: Session, filepath: Path) -> int:
    """从 CSV 文件导入航线数据。

    :param session: SQLAlchemy 会话对象
    :param filepath: CSV 文件路径
    :return: 成功导入的航线条数
    """
    with filepath.open("r", encoding="utf-8") as fp:
        reader = csv.DictReader(fp)
        items = [FlightRouteCreate(**row) for row in reader]
    return _bulk_create(session, items)


def import_from_json(session: Session, filepath: Path) -> int:
    """从 JSON 文件导入航线数据。

    支持两种格式：
    1. JSON 数组：[{...}, {...}]
    2. 含 data 字段的对象：{"data": [{...}]}
    """
    with filepath.open("r", encoding="utf-8") as fp:
        payload = json.load(fp)
    if isinstance(payload, list):
        items = payload
    else:
        items = payload.get("data", [])
    parsed_items = [FlightRouteCreate(**item) for item in items]
    return _bulk_create(session, parsed_items)
