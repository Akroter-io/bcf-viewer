import './styles/main.css';
import { FileDropZone } from './components/FileDropZone';
import BCFViewer from './components/BCFViewer';

document.addEventListener('DOMContentLoaded', () => {
	const dropZoneElement = document.getElementById('drop-zone');
	const viewerElement = document.getElementById('bcf-viewer');

	if (!dropZoneElement || !viewerElement) {
		console.error('Required DOM elements not found');
		return;
	}

	const bcfViewer = new BCFViewer(viewerElement);
	const fileDropZone = new FileDropZone(dropZoneElement);

	fileDropZone.onFileDropped = (file: File) => {
		bcfViewer.loadBCFFile(file);
	};
});