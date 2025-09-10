export class FileDropZone {
	private element: HTMLElement;
	private fileInput!: HTMLInputElement;
	public onFileDropped?: (file: File) => void;

	constructor(element: HTMLElement) {
		this.element = element;
		this.createFileInput();
		this.setupEventListeners();
	}

	private createFileInput() {
		// Create hidden file input
		this.fileInput = document.createElement('input');
		this.fileInput.type = 'file';
		this.fileInput.accept = '.bcf,.bcfzip';
		this.fileInput.style.display = 'none';
		document.body.appendChild(this.fileInput);

		// Handle file selection
		this.fileInput.addEventListener('change', (e) => {
			const target = e.target as HTMLInputElement;
			if (target.files && target.files.length > 0) {
				this.handleFile(target.files[0]);
			}
		});
	}

	private setupEventListeners() {
		// Click to browse
		this.element.addEventListener('click', () => {
			this.fileInput.click();
		});

		// Drag and drop events
		this.element.addEventListener('dragover', (e) => {
			e.preventDefault();
			this.element.classList.add('drag-over');
		});

		this.element.addEventListener('dragleave', () => {
			this.element.classList.remove('drag-over');
		});

		this.element.addEventListener('drop', (e) => {
			e.preventDefault();
			this.element.classList.remove('drag-over');

			const files = e.dataTransfer?.files;
			if (files && files.length > 0) {
				this.handleFile(files[0]);
			}
		});
	}

	private handleFile(file: File) {
		if (this.onFileDropped) {
			this.onFileDropped(file);
		}
	}
}