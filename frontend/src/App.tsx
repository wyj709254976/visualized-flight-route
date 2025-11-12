import { useMemo, useState } from "react";
import FilterPanel from "./components/FilterPanel";
import FlightMap from "./components/FlightMap";
import { useFlightData } from "./hooks/useFlightData";
import type { FlightFilter, FlightRoute } from "./types";

function App() {
  const [highlightRoutes, setHighlightRoutes] = useState<FlightRoute[]>([]);
  const { routes, cities, loading, error, refresh } = useFlightData();

  const handleFilterChange = async (filter: FlightFilter) => {
    const updatedRoutes = await refresh(filter);
    if (filter.departure_city || filter.destination_city) {
      const matched = updatedRoutes.filter((route) => {
        const matchDeparture = filter.departure_city
          ? route.departure_city === filter.departure_city
          : true;
        const matchDestination = filter.destination_city
          ? route.destination_city === filter.destination_city
          : true;
        return matchDeparture && matchDestination;
      });
      setHighlightRoutes(matched);
    } else {
      setHighlightRoutes([]);
    }
  };

  const mapTitle = useMemo(() => {
    if (highlightRoutes.length === 0) {
      return "全球航线分布";
    }
    const first = highlightRoutes[0];
    return `${first.departure_city} → ${first.destination_city} 重点航线`;
  }, [highlightRoutes]);

  return (
    <div className="app-container">
      <FilterPanel
        cities={cities}
        loading={loading}
        routes={routes}
        onFilterChange={handleFilterChange}
      />
      <div className="main-panel">
        <h2>{mapTitle}</h2>
        {error && <span style={{ color: "#ef4444" }}>{error}</span>}
        <FlightMap routes={routes} highlight={highlightRoutes} />
      </div>
    </div>
  );
}

export default App;
