import type { WeatherService } from './weatherService';

export interface LocationData {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export class LocationService {
  private weatherService: WeatherService;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(weatherService: WeatherService) {
    this.weatherService = weatherService;
  }

  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const location = await this.reverseGeocode(
              position.coords.latitude,
              position.coords.longitude,
            );
            resolve(location);
          } catch (error) {
            reject(error);
          }
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

    return new Promise((resolve) => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(async () => {
        try {
          const weather = await this.weatherService.getCurrentWeather(query);
          resolve([
            {
              name: weather.location.name,
              country: weather.location.country,
              lat: weather.location.lat,
              lon: weather.location.lon,
            },
          ]);
        } catch {
          resolve([]);
        }
      }, 300);
    });
  }

  async reverseGeocode(lat: number, lon: number): Promise<LocationData> {
    try {
      const weather = await this.weatherService.getCurrentWeather(`${lat},${lon}`);
      return {
        name: weather.location.name,
        country: weather.location.country,
        lat: weather.location.lat,
        lon: weather.location.lon,
      };
    } catch {
      throw new Error('Failed to reverse geocode location');
    }
  }
}
