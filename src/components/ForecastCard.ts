import type { ForecastDay } from '../types/weather';

export class ForecastCard {
  private container: HTMLElement;
  private element: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(forecast: ForecastDay[]): void {
    this.destroy();

    const card = document.createElement('div');
    card.className = 'forecast-card';

    const heading = document.createElement('h3');
    heading.className = 'forecast-card__heading';
    heading.textContent = 'Forecast';
    card.appendChild(heading);

    const list = document.createElement('div');
    list.className = 'forecast-card__list';

    for (const day of forecast) {
      const dayEl = document.createElement('div');
      dayEl.className = 'forecast-card__day';

      const date = new Date(day.date + 'T00:00:00');
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      dayEl.innerHTML = `
        <div class="forecast-card__day-name">${dayName}</div>
        <div class="forecast-card__day-date">${monthDay}</div>
        <img class="forecast-card__icon" src="${day.icon}" alt="${day.description}" />
        <div class="forecast-card__description">${day.description}</div>
        <div class="forecast-card__temps">
          <span class="forecast-card__temp-max">${Math.round(day.temperature.max)}°</span>
          <span class="forecast-card__temp-min">${Math.round(day.temperature.min)}°</span>
        </div>
        <div class="forecast-card__meta">
          <span>${day.humidity}% humidity</span>
          <span>${day.windSpeed} km/h</span>
        </div>
      `;

      list.appendChild(dayEl);
    }

    card.appendChild(list);
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
