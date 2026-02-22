export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temperature: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    feelsLike: number;
  };
  forecast: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface ApiResponse {
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    pressure_mb: number;
    feelslike_c: number;
  };
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        mintemp_c: number;
        maxtemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
        avghumidity: number;
        maxwind_kph: number;
      };
    }>;
  };
}