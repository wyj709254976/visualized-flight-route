# 后端服务（FastAPI）

本目录包含航线可视化平台的后端服务源码，基于 FastAPI + SQLAlchemy 构建。

## 本地运行步骤

1. 创建虚拟环境并安装依赖：

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. 可选：初始化示例数据，方便前端展示：

   ```bash
   python -m app.db.init_db
   ```

3. 启动开发服务器：

   ```bash
   uvicorn app.main:app --reload
   ```

4. 访问接口文档：`http://127.0.0.1:8000/docs`

## 目录结构

- `app/main.py`：应用入口，加载路由与中间件。
- `app/api/routes.py`：RESTful API 路由定义。
- `app/models/flight.py`：航线 ORM 模型。
- `app/schemas/flight.py`：请求/响应模型定义。
- `app/services/flight_importer.py`：CSV/JSON 导入工具。
- `app/db/session.py`：数据库会话与引擎配置。
- `app/db/init_db.py`：开发环境示例数据初始化脚本。
