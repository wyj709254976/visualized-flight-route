import { useCallback, useEffect, useState } from "react";
import apiClient from "../api/client";
import type { CityDictionary, FlightFilter, FlightRoute } from "../types";

interface UseFlightDataResult {
  routes: FlightRoute[];
  cities: CityDictionary | null;
  loading: boolean;
  error: string | null;
  refresh: (filter?: FlightFilter) => Promise<FlightRoute[]>;
}

const DEFAULT_FILTER: FlightFilter = {
  min_daily_flight_count: 0
};

/**
 * 自定义 Hook：封装航线数据获取逻辑。
 */
export function useFlightData(initialFilter: FlightFilter = DEFAULT_FILTER): UseFlightDataResult {
  const [routes, setRoutes] = useState<FlightRoute[]>([]);
  const [cities, setCities] = useState<CityDictionary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    try {
      const response = await apiClient.get<CityDictionary>("/cities");
      setCities(response.data);
    } catch (err) {
      console.error("获取城市列表失败", err);
      setError("无法加载城市列表，请稍后再试。");
    }
  }, []);

  const fetchRoutes = useCallback(
    async (filter: FlightFilter = initialFilter) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<FlightRoute[]>("/routes", {
          params: filter
        });
        setRoutes(response.data);
        return response.data;
      } catch (err) {
        console.error("获取航线数据失败", err);
        setError("无法加载航线数据，请稍后再试。");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [initialFilter]
  );

  const refresh = useCallback(
    async (filter?: FlightFilter) => {
      return fetchRoutes(filter ?? initialFilter);
    },
    [fetchRoutes, initialFilter]
  );

  useEffect(() => {
    fetchCities();
    fetchRoutes(initialFilter);
  }, [fetchCities, fetchRoutes, initialFilter]);

  return {
    routes,
    cities,
    loading,
    error,
    refresh
  };
}
