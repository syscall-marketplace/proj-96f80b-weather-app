import type { LocationData } from '../services/locationService';

export class SearchBox {
  private container: HTMLElement;
  private onSearch: (city: string) => void;
  private element: HTMLElement | null = null;
  private input: HTMLInputElement | null = null;
  private suggestionsEl: HTMLElement | null = null;
  private boundHandleDocumentClick: (e: MouseEvent) => void;

  constructor(container: HTMLElement, onSearch: (city: string) => void) {
    this.container = container;
    this.onSearch = onSearch;
    this.boundHandleDocumentClick = this.handleDocumentClick.bind(this);
  }

  render(): void {
    this.destroy();

    const wrapper = document.createElement('div');
    wrapper.className = 'search-box';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'search-box__input';
    input.placeholder = 'Search for a city...';
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        this.hideSuggestions();
        this.onSearch(input.value.trim());
      }
    });
    input.addEventListener('input', () => {
      if (!input.value.trim()) {
        this.hideSuggestions();
      }
    });

    const button = document.createElement('button');
    button.className = 'search-box__button';
    button.textContent = 'Search';
    button.addEventListener('click', () => {
      if (input.value.trim()) {
        this.hideSuggestions();
        this.onSearch(input.value.trim());
      }
    });

    const suggestions = document.createElement('ul');
    suggestions.className = 'search-box__suggestions';
    suggestions.style.display = 'none';

    wrapper.appendChild(input);
    wrapper.appendChild(button);
    wrapper.appendChild(suggestions);

    this.element = wrapper;
    this.input = input;
    this.suggestionsEl = suggestions;
    this.container.appendChild(wrapper);

    document.addEventListener('click', this.boundHandleDocumentClick);
  }

  showSuggestions(cities: LocationData[]): void {
    if (!this.suggestionsEl) return;

    this.suggestionsEl.innerHTML = '';

    if (cities.length === 0) {
      this.suggestionsEl.style.display = 'none';
      return;
    }

    for (const city of cities) {
      const li = document.createElement('li');
      li.className = 'search-box__suggestion';
      li.textContent = `${city.name}, ${city.country}`;
      li.addEventListener('click', () => {
        if (this.input) {
          this.input.value = city.name;
        }
        this.hideSuggestions();
        this.onSearch(city.name);
      });
      this.suggestionsEl.appendChild(li);
    }

    this.suggestionsEl.style.display = 'block';
  }

  destroy(): void {
    document.removeEventListener('click', this.boundHandleDocumentClick);
    if (this.element) {
      this.element.remove();
      this.element = null;
      this.input = null;
      this.suggestionsEl = null;
    }
  }

  private hideSuggestions(): void {
    if (this.suggestionsEl) {
      this.suggestionsEl.style.display = 'none';
    }
  }

  private handleDocumentClick(e: MouseEvent): void {
    if (this.element && !this.element.contains(e.target as Node)) {
      this.hideSuggestions();
    }
  }
}
