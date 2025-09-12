import { BCFData, MarkupData, Comment } from '../types/bcf';
import { ImageSlider } from './ImageSlider';
import { parseBCFFile } from '../utils/bcfParser';
import { formatDateTime } from '../utils/dateFormatter';
import { getRelativeTime } from '../utils/relativeTime';

export default class BCFViewer {
	private container: HTMLElement;
	private currentData: BCFData | null = null;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	public async loadBCFFile(file: File): Promise<void> {
		try {
			this.showLoading();
			this.currentData = await parseBCFFile(file);
			this.render();
		} catch (error) {
			console.error('Error loading BCF file:', error);
			this.showError('Failed to load BCF file');
		}
	}

	private showLoading(): void {
		this.container.innerHTML = '<div class="loading">Loading BCF file...</div>';
	}

	private showError(message: string): void {
		this.container.innerHTML = `<div class="error">${message}</div>`;
	}

	private render(): void {
		if (!this.currentData) return;

		this.container.innerHTML = '';

		const headerDiv = document.createElement('div');
		headerDiv.className = 'bcf-header';
		headerDiv.innerHTML = `
	  <h2>BCF File Contents</h2>
	  <p>Version: ${this.currentData.version.VersionId}</p>
	  ${this.currentData.project ? `<p>Project: ${this.currentData.project.Name || 'Unnamed'}</p>` : ''}
	`;
		this.container.appendChild(headerDiv);

		this.currentData.topics.forEach((topicData, index) => {
			const topicElement = this.renderTopicElement(topicData, index);
			this.container.appendChild(topicElement);
		});
	}


	private renderTopicElement(topic: MarkupData, index: number): HTMLElement {
		const markup = topic.markup;
		console.log(`Rendering topic ${index} with ${topic.images.length} images`);

		const topicDiv = document.createElement('div');
		topicDiv.className = 'topic';
		topicDiv.setAttribute('data-topic-index', index.toString());

		const title = document.createElement('h3');
		title.textContent = `Topic: ${markup.Topic?.Title || 'Untitled'}`;
		topicDiv.appendChild(title);

		const detailsDiv = document.createElement('div');
		detailsDiv.className = 'topic-details';

		const table = document.createElement('table');
		table.className = 'topic-details-table';

		// Create table rows for each detail
		const details = [
			{ label: 'Status', value: markup.Topic?.TopicStatus || 'Unknown', isDate: false, originalDate: null },
			{ label: 'Priority', value: markup.Topic?.Priority || 'Unknown', isDate: false, originalDate: null },
			{ label: 'Creation Date', value: markup.Topic?.CreationDate ? formatDateTime(markup.Topic.CreationDate) : 'Unknown', isDate: true, originalDate: markup.Topic?.CreationDate },
			{ label: 'Creation Author', value: markup.Topic?.CreationAuthor || 'Unknown', isDate: false, originalDate: null }
		];

		// Add optional details if they exist
		if (markup.Topic?.ModifiedDate) {
			details.push({ label: 'Modified Date', value: formatDateTime(markup.Topic.ModifiedDate), isDate: true, originalDate: markup.Topic.ModifiedDate });
		}
		if (markup.Topic?.ModifiedAuthor) {
			details.push({ label: 'Modified Author', value: markup.Topic.ModifiedAuthor, isDate: false, originalDate: null });
		}
		if (markup.Topic?.AssignedTo) {
			details.push({ label: 'Assigned To', value: markup.Topic.AssignedTo, isDate: false, originalDate: null });
		}

		// Create table rows
		details.forEach(detail => {
			const row = document.createElement('tr');
			const valueClass = detail.isDate ? 'detail-value detail-time' : 'detail-value';
			const titleAttribute = detail.isDate && detail.originalDate ? ` title="${getRelativeTime(detail.originalDate)}"` : '';
			row.innerHTML = `
				<td class="detail-label"><strong>${detail.label}:</strong></td>
				<td class="${valueClass}"${titleAttribute}>${detail.value}</td>
			`;
			table.appendChild(row);
		});

		detailsDiv.appendChild(table);
		topicDiv.appendChild(detailsDiv);

		// Add comments section only if there are comments
		if (markup.Topic?.Comments?.Comment) {
			const commentsElement = this.renderCommentsElement({ Comment: markup.Topic.Comments.Comment });
			topicDiv.appendChild(commentsElement);
		}

		// Add the images section
		const imagesElement = this.renderTopicImagesElement(topic.images);
		topicDiv.appendChild(imagesElement);

		return topicDiv;
	}

	private renderTopicImagesElement(images: string[]): HTMLElement {
		console.log(`Rendering ${images.length} images:`, images);

		const container = document.createElement('div');
		container.className = 'images';

		if (!images || images.length === 0) {
			const noImages = document.createElement('p');
			noImages.textContent = 'No images available';
			container.appendChild(noImages);
			return container;
		}

		images.forEach((imageUrl, index) => {
			const imageContainer = document.createElement('div');
			imageContainer.className = 'image-container';
			imageContainer.style.margin = '10px 0';

			const label = document.createElement('p');
			label.textContent = `Image ${index + 1}:`;
			imageContainer.appendChild(label);

			const img = document.createElement('img');
			img.src = imageUrl;
			img.alt = `BCF Image ${index + 1}`;

			img.onload = () => console.log('Image loaded:', imageUrl);
			img.onerror = () => console.error('Failed to load image:', imageUrl);

			imageContainer.appendChild(img);
			container.appendChild(imageContainer);
		});

		return container;
	}

	private renderCommentsElement(comments: { Comment: Comment | Comment[] }): HTMLElement {
		const container = document.createElement('div');
		container.className = 'comments-section';

		// Create comments header
		const header = document.createElement('h4');
		header.textContent = 'Comments';
		header.className = 'comments-header';
		container.appendChild(header);

		const commentArray = Array.isArray(comments.Comment) ? comments.Comment : [comments.Comment];

		// dumb hack because someone had the dumb idea to have the <Comment> inside a <Comment>...
		const validComments = commentArray.filter(comment =>
			comment && comment.Comment && comment.Comment.trim() !== ''
		);

		validComments.forEach((comment) => {
			const commentDiv = document.createElement('div');
			commentDiv.className = 'comment';

			const commentHeader = document.createElement('div');
			commentHeader.className = 'comment-header';
			const dateTitle = comment.Date ? ` title="${getRelativeTime(comment.Date)}"` : '';
			commentHeader.innerHTML = `
				<strong>${comment.Author || 'Unknown Author'}</strong>
				<span class="comment-date detail-time"${dateTitle}>${comment.Date ? formatDateTime(comment.Date) : 'Unknown Date'}</span>
			`;

			const commentBody = document.createElement('div');
			commentBody.className = 'comment-body';
			commentBody.textContent = comment.Comment || '';

			commentDiv.appendChild(commentHeader);
			commentDiv.appendChild(commentBody);

			// Add modification info if available
			if (comment.ModifiedDate && comment.ModifiedAuthor) {
				const modificationInfo = document.createElement('div');
				modificationInfo.className = 'comment-modification';
				const modDateTitle = ` title="${getRelativeTime(comment.ModifiedDate)}"`;
				modificationInfo.innerHTML = `
					<small>Modified by <strong>${comment.ModifiedAuthor}</strong> on <span class="detail-time"${modDateTitle}>${formatDateTime(comment.ModifiedDate)}</span></small>
				`;
				commentDiv.appendChild(modificationInfo);
			}

			container.appendChild(commentDiv);
		});

		return container;
	}

}