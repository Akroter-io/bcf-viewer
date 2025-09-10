export class ImageSlider {
    private container: HTMLElement;
    private images: string[];
    private currentIndex: number = 0;
    private prevButton!: HTMLButtonElement;
    private nextButton!: HTMLButtonElement;
    private imageElement!: HTMLImageElement;

    constructor(container: HTMLElement, images: string[]) {
        this.container = container;
        this.images = images;
        this.init();
    }

    private init(): void {
        this.container.innerHTML = `
      <div class="image-slider">
        <button class="slider-btn prev-btn">&lt;</button>
        <img class="slider-image" src="${this.images[0]}" alt="BCF Image" />
        <button class="slider-btn next-btn">&gt;</button>
        <div class="image-counter">${this.currentIndex + 1} / ${this.images.length}</div>
      </div>
    `;

        this.prevButton = this.container.querySelector('.prev-btn') as HTMLButtonElement;
        this.nextButton = this.container.querySelector('.next-btn') as HTMLButtonElement;
        this.imageElement = this.container.querySelector('.slider-image') as HTMLImageElement;

        this.setupEventListeners();
        this.updateButtons();
    }

    private setupEventListeners(): void {
        this.prevButton.addEventListener('click', () => this.previousImage());
        this.nextButton.addEventListener('click', () => this.nextImage());
    }

    private previousImage(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateImage();
        }
    }

    private nextImage(): void {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.updateImage();
        }
    }

    private updateImage(): void {
        this.imageElement.src = this.images[this.currentIndex];
        this.updateCounter();
        this.updateButtons();
    }

    private updateCounter(): void {
        const counter = this.container.querySelector('.image-counter');
        if (counter) {
            counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        }
    }

    private updateButtons(): void {
        this.prevButton.disabled = this.currentIndex === 0;
        this.nextButton.disabled = this.currentIndex === this.images.length - 1;

        if (this.images.length <= 1) {
            this.prevButton.style.display = 'none';
            this.nextButton.style.display = 'none';
        }
    }
}