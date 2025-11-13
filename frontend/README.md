# 前端应用（React + Vite）

本目录为航线可视化平台的前端源码，采用 React + TypeScript + Vite 构建。

## 安装与运行

```bash
cd frontend
npm install
npm run dev
```

开发服务器默认端口为 `5173`，已通过 `vite.config.ts` 代理后端 `http://127.0.0.1:8000` 的 `/api` 请求。

## 主要功能模块

- `src/components/FlightMap.tsx`：基于 ECharts 绘制航线地图。
- `src/components/FilterPanel.tsx`：筛选条件面板，可设置出发地、目的地、航班数阈值。
- `src/hooks/useFlightData.ts`：封装航线数据与城市列表的获取逻辑。
- `src/types.ts`：前端类型定义。
