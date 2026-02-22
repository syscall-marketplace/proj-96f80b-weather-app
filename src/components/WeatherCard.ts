import type { WeatherData } from '../types/weather';

export class WeatherCard {
  private container: HTMLElement;
  private element: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(weather: WeatherData): void {
    this.destroy();

    const card = document.createElement('div');
    card.className = 'weather-card';
    card.innerHTML = `
      <div class="weather-card__location">
        <h2>${weather.location.name}</h2>
        <span>${weather.location.country}</span>
      </div>
      <div class="weather-card__main">
        <img class="weather-card__icon" src="${weather.current.icon}" alt="${weather.current.description}" />
        <div class="weather-card__temp">${Math.round(weather.current.temperature)}°C</div>
        <div class="weather-card__description">${weather.current.description}</div>
      </div>
      <div class="weather-card__details">
        <div class="weather-card__detail">
          <span class="weather-card__detail-label">Feels Like</span>
          <span class="weather-card__detail-value">${Math.round(weather.current.feelsLike)}°C</span>
        </div>
        <div class="weather-card__detail">
          <span class="weather-card__detail-label">Humidity</span>
          <span class="weather-card__detail-value">${weather.current.humidity}%</span>
        </div>
        <div class="weather-card__detail">
          <span class="weather-card__detail-label">Wind</span>
          <span class="weather-card__detail-value">${weather.current.windSpeed} km/h</span>
        </div>
        <div class="weather-card__detail">
          <span class="weather-card__detail-label">Pressure</span>
          <span class="weather-card__detail-value">${weather.current.pressure} mb</span>
        </div>
      </div>
    `;

    this.element = card;
    this.container.appendChild(card);
  }

  destroy(): void {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
