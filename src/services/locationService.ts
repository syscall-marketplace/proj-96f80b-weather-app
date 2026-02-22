import axios, { type AxiosInstance } from 'axios';
import type { WeatherService } from './weatherService';

export interface LocationData {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface SearchApiResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

export class LocationService {
  private client: AxiosInstance;

  constructor(weatherService: WeatherService) {
    // Access the underlying axios client to reuse the same base URL and API key
    const ws = weatherService as unknown as { client: AxiosInstance };
    this.client = ws.client;
  }

  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.reverseGeocode(position.coords.latitude, position.coords.longitude)
            .then(resolve)
            .catch(reject);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Location permission denied'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Location information unavailable'));
              break;
            case error.TIMEOUT:
              reject(new Error('Location request timed out'));
              break;
            default:
              reject(new Error('Failed to get current location'));
          }
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
      );
    });
  }

  async searchCities(query: string): Promise<LocationData[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const response = await this.client.get<SearchApiResult[]>('/search.json', {
        params: { q: query.trim() },
      });
      return response.data.map((item) => ({
        name: item.name,
        country: item.country,
        lat: item.lat,
        lon: item.lon,
      }));
    } catch {
      return [];
    }
  }

  async reverseGeocode(lat: number, lon: number): Promise<LocationData> {
    try {
      const response = await this.client.get<SearchApiResult[]>('/search.json', {
        params: { q: `${lat},${lon}` },
      });

      if (response.data.length === 0) {
        throw new Error('No results found');
      }

      const result = response.data[0];
      return {
        name: result.name,
        country: result.country,
        lat: result.lat,
        lon: result.lon,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to reverse geocode: ${error.message}`);
      }
      throw error;
    }
  }
}

export function debounceSearch(
  service: LocationService,
  delay = 300,
): (query: string) => Promise<LocationData[]> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingReject: ((reason: string) => void) | null = null;

  return (query: string): Promise<LocationData[]> => {
    return new Promise((resolve, reject) => {
      if (timer) {
        clearTimeout(timer);
        if (pendingReject) {
          pendingReject('debounced');
        }
      }
      pendingReject = reject;
      timer = setTimeout(() => {
        pendingReject = null;
        service.searchCities(query).then(resolve).catch(reject);
      }, delay);
    });
  };
}
