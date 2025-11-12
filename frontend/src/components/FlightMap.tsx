import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "echarts-gl";
import worldGeoJSON from "echarts/map/json/world.json?json";
import type { FlightRoute } from "../types";

// 注册世界地图数据，确保 Geo 组件可以正常渲染
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(echarts as any).registerMap("world", worldGeoJSON as any);

interface FlightMapProps {
  routes: FlightRoute[];
  highlight?: FlightRoute[];
}

/**
 * 航线地图组件，使用 ECharts Geo 进行渲染。
 */
export function FlightMap({ routes, highlight = [] }: FlightMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  // 根据航班数量计算线条宽度
  const calculateLineWidth = (count: number): number => {
    if (count > 100) return 6;
    if (count > 50) return 4;
    if (count > 10) return 2.5;
    return 1.5;
  };

  const buildSeries = () => {
    const normalSeries = {
      type: "lines",
      coordinateSystem: "geo",
      data: routes.map((route) => ({
        coords: [
          [route.longitude_departure, route.latitude_departure],
          [route.longitude_destination, route.latitude_destination]
        ],
        value: route.daily_flight_count,
        lineStyle: {
          width: calculateLineWidth(route.daily_flight_count),
          color: "rgba(37, 99, 235, 0.6)",
          curveness: 0.2
        }
      })),
      effect: {
        show: true,
        period: 6,
        trailLength: 0.1,
        color: "#93c5fd",
        symbolSize: 4
      },
      blendMode: "lighter"
    };

    const highlightSeries = {
      type: "lines",
      coordinateSystem: "geo",
      data: highlight.map((route) => ({
        coords: [
          [route.longitude_departure, route.latitude_departure],
          [route.longitude_destination, route.latitude_destination]
        ],
        value: route.daily_flight_count,
        lineStyle: {
          width: calculateLineWidth(route.daily_flight_count) + 1,
          color: "#f97316",
          curveness: 0.2
        }
      })),
      effect: {
        show: highlight.length > 0,
        period: 4,
        trailLength: 0.2,
        color: "#fb923c",
        symbolSize: 6
      },
      zlevel: 2
    };

    return highlight.length > 0 ? [normalSeries, highlightSeries] : [normalSeries];
  };

  useEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }

    const resizeHandler = () => {
      chartRef.current?.resize();
    };
    window.addEventListener("resize", resizeHandler);

    chartRef.current.setOption({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const value = params.data?.value ?? 0;
          return `每日航班数量：${value}`;
        }
      },
      geo: {
        map: "world",
        roam: true,
        label: {
          show: false
        },
        itemStyle: {
          areaColor: "#1d4ed8",
          borderColor: "#93c5fd",
          opacity: 0.2
        },
        emphasis: {
          itemStyle: {
            areaColor: "#2563eb"
          }
        }
      },
      series: buildSeries()
    });

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [routes, highlight]);

  return <div ref={containerRef} className="map-container" />;
}

export default FlightMap;
