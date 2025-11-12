import { useMemo, useState } from "react";
import type { CityDictionary, FlightFilter, FlightRoute } from "../types";

interface FilterPanelProps {
  cities: CityDictionary | null;
  loading: boolean;
  onFilterChange: (filter: FlightFilter) => void;
  routes: FlightRoute[];
}

/**
 * 筛选条件面板组件，用于设置出发地、目的地和航班数量阈值。
 */
export function FilterPanel({ cities, loading, onFilterChange, routes }: FilterPanelProps) {
  const [departureCity, setDepartureCity] = useState<string>("");
  const [destinationCity, setDestinationCity] = useState<string>("");
  const [minFlights, setMinFlights] = useState<number>(0);

  const totalFlights = useMemo(() => routes.length, [routes]);

  const handleApply = () => {
    onFilterChange({
      departure_city: departureCity || undefined,
      destination_city: destinationCity || undefined,
      min_daily_flight_count: Number.isNaN(minFlights) ? 0 : minFlights
    });
  };

  const handleReset = () => {
    setDepartureCity("");
    setDestinationCity("");
    setMinFlights(0);
    onFilterChange({
      min_daily_flight_count: 0
    });
  };

  return (
    <div className="sidebar">
      <h1>航线筛选器</h1>
      <p>请选择需要查看的航线条件，系统会自动刷新地图。</p>

      <div className="filter-group">
        <label htmlFor="departure-select">出发城市</label>
        <select
          id="departure-select"
          value={departureCity}
          onChange={(event) => setDepartureCity(event.target.value)}
        >
          <option value="">全部出发城市</option>
          {cities?.departure_cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="destination-select">目的城市</label>
        <select
          id="destination-select"
          value={destinationCity}
          onChange={(event) => setDestinationCity(event.target.value)}
        >
          <option value="">全部目的城市</option>
          {cities?.destination_cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="min-flights">最小航班数量</label>
        <input
          id="min-flights"
          type="number"
          min={0}
          value={minFlights}
          onChange={(event) => setMinFlights(Number(event.target.value))}
        />
      </div>

      <button onClick={handleApply} disabled={loading}>
        {loading ? "加载中..." : "应用筛选"}
      </button>
      <button onClick={handleReset} disabled={loading}>
        重置条件
      </button>

      <div className="status-bar">
        <span>当前航线：{totalFlights} 条</span>
        {loading && <span>刷新中...</span>}
      </div>

      {cities && (
        <div>
          <h2>城市总览</h2>
          <div className="tag-list">
            {cities.departure_cities.slice(0, 12).map((city) => (
              <span className="tag" key={`dep-${city}`}>
                出发 · {city}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
