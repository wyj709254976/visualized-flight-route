export interface FlightRoute {
  id: number;
  departure_city: string;
  destination_city: string;
  daily_flight_count: number;
  longitude_departure: number;
  latitude_departure: number;
  longitude_destination: number;
  latitude_destination: number;
}

export interface FlightFilter {
  departure_city?: string;
  destination_city?: string;
  min_daily_flight_count?: number;
}

export interface CityDictionary {
  departure_cities: string[];
  destination_cities: string[];
}
