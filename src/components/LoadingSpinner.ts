export class LoadingSpinner {
  private container: HTMLElement;
  private element: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;

    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
      <div class="loading-spinner__circle"></div>
      <span class="loading-spinner__text">Loading...</span>
    `;
    spinner.style.display = 'none';

    this.element = spinner;
    this.container.appendChild(spinner);
  }

  show(): void {
    this.element.style.display = 'flex';
  }

  hide(): void {
    this.element.style.display = 'none';
  }
}
