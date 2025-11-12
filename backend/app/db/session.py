"""数据库会话与引擎配置模块。"""
from __future__ import annotations

from pathlib import Path
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

# SQLite 数据库文件路径（开发阶段默认使用项目根目录下的 database.db 文件）
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATABASE_URL = f"sqlite:///{BASE_DIR / 'database.db'}"

# 创建 SQLAlchemy 引擎与会话工厂
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # SQLite 在多线程场景下需要关闭同线程校验
)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# 声明式基类，供 ORM 模型继承
Base = declarative_base()


def get_session() -> Generator[Session, None, None]:
    """FastAPI 依赖项：获取数据库会话并在请求结束后关闭。"""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
