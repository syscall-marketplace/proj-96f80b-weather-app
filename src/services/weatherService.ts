import axios, { AxiosInstance } from 'axios';
import type { WeatherData, ForecastDay, ApiResponse } from '../types/weather';

export class WeatherApiError extends Error {
  public statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'WeatherApiError';
    this.statusCode = statusCode;
  }
}

function transformCurrent(response: ApiResponse): WeatherData {
  return {
    location: {
      name: response.location.name,
      country: response.location.country,
      lat: response.location.lat,
      lon: response.location.lon,
    },
    current: {
      temperature: response.current.temp_c,
      description: response.current.condition.text,
      icon: response.current.condition.icon,
      humidity: response.current.humidity,
      windSpeed: response.current.wind_kph,
      pressure: response.current.pressure_mb,
      feelsLike: response.current.feelslike_c,
    },
    forecast: [],
  };
}

function transformForecast(response: ApiResponse): WeatherData {
  const forecastDays: ForecastDay[] = response.forecast.forecastday.map((day) => ({
    date: day.date,
    temperature: {
      min: day.day.mintemp_c,
      max: day.day.maxtemp_c,
    },
    description: day.day.condition.text,
    icon: day.day.condition.icon,
    humidity: day.day.avghumidity,
    windSpeed: day.day.maxwind_kph,
  }));

  return {
    location: {
      name: response.location.name,
      country: response.location.country,
      lat: response.location.lat,
      lon: response.location.lon,
    },
    current: {
      temperature: response.current.temp_c,
      description: response.current.condition.text,
      icon: response.current.condition.icon,
      humidity: response.current.humidity,
      windSpeed: response.current.wind_kph,
      pressure: response.current.pressure_mb,
      feelsLike: response.current.feelslike_c,
    },
    forecast: forecastDays,
  };
}

export class WeatherService {
  private client: AxiosInstance;

  constructor(apiKey: string, baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      params: { key: apiKey },
    });
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      const response = await this.client.get<ApiResponse>('/current.json', {
        params: { q: city },
      });
      return transformCurrent(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new WeatherApiError(
          error.response?.data?.error?.message ?? error.message,
          error.response?.status,
        );
      }
      throw new WeatherApiError('Failed to fetch current weather');
    }
  }

  async getForecast(city: string, days: number): Promise<WeatherData> {
    try {
      const response = await this.client.get<ApiResponse>('/forecast.json', {
        params: { q: city, days },
      });
      return transformForecast(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new WeatherApiError(
          error.response?.data?.error?.message ?? error.message,
          error.response?.status,
        );
      }
      throw new WeatherApiError('Failed to fetch forecast');
    }
  }
}
