"""FastAPI 应用入口。"""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import router as api_router
from .db.session import Base, engine

# 创建数据库表（开发环境下自动创建）
Base.metadata.create_all(bind=engine)

app = FastAPI(title="航班航线可视化平台 API", version="0.1.0")

# 配置 CORS，方便本地前端调试
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册 API 路由
app.include_router(api_router)


@app.get("/health", summary="服务健康检查")
def health_check() -> dict[str, str]:
    """返回服务健康状态，便于部署时监控。"""
    return {"status": "ok"}
