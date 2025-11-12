# visualized-flight-route

航班航线可视化平台的整体工程，包含前端 React 应用与后端 FastAPI 服务。

## 项目结构

```
visualized-flight-route/
├── backend/        # FastAPI 后端服务
├── frontend/       # React + Vite 前端项目
└── README.md       # 项目简介
```

## 快速开始

### 后端（FastAPI）

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

服务启动后可访问接口文档：`http://127.0.0.1:8000/docs`

### 前端（React + Vite）

```bash
cd frontend
npm install
npm run dev
```

浏览器访问 `http://127.0.0.1:5173`，即可看到航线可视化界面。

## 功能概览

- 航线数据管理：加载数据库中的航线信息，支持批量导入 CSV/JSON。
- 航线可视化展示：基于 ECharts 动态绘制全球航线，展示航班数量。
- 航线检索功能：筛选出发地、目的地及航班数量阈值，高亮匹配航线。
- 数据筛选与动态更新：通过 RESTful API 实现前后端数据交互。

## 未来规划

- 引入实时航班 API，支持数据自动更新。
- 支持 3D 地球展示模式（如 Cesium.js）。
- 增强城市节点交互，展示关联航线统计信息。
