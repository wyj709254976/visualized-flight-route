# visualized-flight-route

航班航线可视化平台的整体工程，包含后端 FastAPI 服务与前端 React 应用。本指南面向 **Windows 11 + VS Code** 环境，帮助你按照顺序完成开发环境搭建与项目运行。

## 1. 环境准备

1. 安装 [Python 3.11+](https://www.python.org/downloads/windows/)，安装时勾选 “Add python.exe to PATH”。
2. 安装 [Node.js 18+ (LTS)](https://nodejs.org/en/download/prebuilt-installer)。
3. 安装 [Git](https://git-scm.com/download/win)。
4. 安装 [Visual Studio Code](https://code.visualstudio.com/Download)。建议在扩展商店安装：
   - **Python**（Microsoft）
   - **Pylance**（Microsoft）
   - **ESLint**（Microsoft）
   - **Prettier**（Prettier）

> 若你已经在本机拥有这些工具，可直接进入下一节。

## 2. 克隆并在 VS Code 中打开项目

1. 打开 **Windows Terminal**（或 PowerShell）。
2. 执行：
   ```powershell
   git clone <仓库地址> visualized-flight-route
   cd visualized-flight-route
   ```
3. 在当前目录执行：
   ```powershell
   code .
   ```
   VS Code 将以当前仓库作为工作区打开。

### VS Code 目录概览

```
visualized-flight-route/
├── backend/        # FastAPI 后端服务
├── frontend/       # React + Vite 前端项目
└── README.md       # 本运行指南
```

## 3. 后端（FastAPI）运行步骤

1. 在 VS Code 中按下 VS Code 快捷键 **Ctrl + `**（反引号键）打开终端，或在 PowerShell 中进入 `backend` 目录：
   ```powershell
   cd backend
   ```
2. 创建虚拟环境并激活（PowerShell 命令）：
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate
   ```
   - **提示**：若 PowerShell 提示执行策略限制，可用管理员权限执行 `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`。
3. 安装依赖：
   ```powershell
   pip install -r requirements.txt
   ```
4. 初始化示例数据库（可选，若需要测试数据）：
   ```powershell
   python -m app.db.init_db
   ```
5. 启动后端服务：
   ```powershell
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
6. 在浏览器访问接口文档确认服务可用：`http://127.0.0.1:8000/docs`

> 完成调试后，输入 `deactivate` 退出虚拟环境。

## 4. 前端（React + Vite）运行步骤

1. 新开一个终端（保持后端运行），进入 `frontend` 目录：
   ```powershell
   cd frontend
   ```
2. 安装依赖：
   ```powershell
   npm install
   ```
3. 启动开发服务器：
   ```powershell
   npm run dev -- --host
   ```
   - 默认端口为 `5173`，控制台会显示访问地址。
4. 打开浏览器访问 `http://127.0.0.1:5173/` 查看航线可视化页面。

## 5. 常用 VS Code 调试技巧

- **同时运行前后端**：使用 VS Code 的“分割终端”功能，一个终端运行 `uvicorn`，另一个运行 `npm run dev`。
- **自动格式化**：前端使用 Prettier，后端可启用 Pylance 检查；可在 VS Code 设置中启用 “Format on Save”。
- **环境变量/配置**：后端默认使用 SQLite 数据库（`backend/app.db`）。如需切换数据库，可修改 `backend/app/db/session.py` 中的连接串，并重新执行 `python -m app.db.init_db`。

## 6. 常见问题排查

| 问题描述 | 解决方案 |
| -------- | -------- |
| PowerShell 无法激活虚拟环境 | 以管理员身份执行 `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` 后重试。 |
| `uvicorn` 无法启动，端口被占用 | 将 `--port 8000` 改为其他未被占用的端口，如 `--port 8080`。 |
| 前端访问后端报错（CORS） | FastAPI 已配置跨域，确保后端正在运行，且访问的主机/端口与命令一致。 |
| Node 模块安装缓慢 | 可配置淘宝源：`npm config set registry https://registry.npmmirror.com`。 |

## 7. 下一步规划

- 增强航线筛选与统计交互，支持更多条件组合。
- 集成实时航班数据源，实现动态刷新。
- 尝试引入 3D 地球展示（Cesium.js）以提升表现力。

祝开发顺利！如需更多帮助，可在 VS Code 中查阅对应目录下的 `README.md` 获取前后端更详细说明。
