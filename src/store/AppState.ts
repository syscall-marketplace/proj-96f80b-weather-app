import { WeatherData, ForecastDay } from '../types/weather';

export interface LocationData {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

type Subscriber = (state: AppState) => void;

const STORAGE_KEY = 'weather-app-state';

interface PersistedState {
  lastCity: string | null;
  units: string;
  favorites: LocationData[];
}

export class AppState {
  private currentWeather: WeatherData | null = null;
  private forecast: ForecastDay[] | null = null;
  private selectedLocation: LocationData | null = null;
  private loading: boolean = false;
  private error: string | null = null;
  private subscribers: Set<Subscriber> = new Set();
  private favorites: LocationData[] = [];
  private units: string = 'metric';
  private lastCity: string | null = null;

  constructor() {
    this.loadFromStorage();
  }

  getCurrentWeather(): WeatherData | null {
    return this.currentWeather;
  }

  getForecast(): ForecastDay[] | null {
    return this.forecast;
  }

  getSelectedLocation(): LocationData | null {
    return this.selectedLocation;
  }

  isLoading(): boolean {
    return this.loading;
  }

  getError(): string | null {
    return this.error;
  }

  getFavorites(): LocationData[] {
    return [...this.favorites];
  }

  getUnits(): string {
    return this.units;
  }

  getLastCity(): string | null {
    return this.lastCity;
  }

  updateWeather(weather: WeatherData): void {
    this.currentWeather = weather;
    this.error = null;
    this.lastCity = weather.location.name;
    this.saveToStorage();
    this.notify();
  }

  updateForecast(forecast: ForecastDay[]): void {
    this.forecast = forecast;
    this.notify();
  }

  setSelectedLocation(location: LocationData): void {
    this.selectedLocation = location;
    this.lastCity = location.name;
    this.saveToStorage();
    this.notify();
  }

  setLoading(loading: boolean): void {
    this.loading = loading;
    this.notify();
  }

  setError(error: string | null): void {
    this.error = error;
    if (error) {
      this.loading = false;
    }
    this.notify();
  }

  setUnits(units: string): void {
    this.units = units;
    this.saveToStorage();
    this.notify();
  }

  addFavorite(location: LocationData): void {
    const exists = this.favorites.some(
      (f) => f.lat === location.lat && f.lon === location.lon
    );
    if (!exists) {
      this.favorites.push(location);
      this.saveToStorage();
      this.notify();
    }
  }

  removeFavorite(location: LocationData): void {
    this.favorites = this.favorites.filter(
      (f) => !(f.lat === location.lat && f.lon === location.lon)
    );
    this.saveToStorage();
    this.notify();
  }

  isFavorite(location: LocationData): boolean {
    return this.favorites.some(
      (f) => f.lat === location.lat && f.lon === location.lon
    );
  }

  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  saveToStorage(): void {
    try {
      const persisted: PersistedState = {
        lastCity: this.lastCity,
        units: this.units,
        favorites: this.favorites,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // localStorage may be unavailable
    }
  }

  loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const persisted: PersistedState = JSON.parse(raw);
        this.lastCity = persisted.lastCity ?? null;
        this.units = persisted.units ?? 'metric';
        this.favorites = persisted.favorites ?? [];
      }
    } catch {
      // localStorage may be unavailable or data corrupted
    }
  }

  private notify(): void {
    for (const callback of this.subscribers) {
      callback(this);
    }
  }
}
