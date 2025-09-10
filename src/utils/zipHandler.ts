import JSZip from 'jszip';

export async function loadZipFile(file: File): Promise<JSZip> {
	const zip = new JSZip();
	return await zip.loadAsync(file);
}

export async function extractFileAsString(zip: JSZip, path: string): Promise<string | null> {
	const file = zip.file(path);
	if (!file) {
		return null;
	}
	return await file.async('string');
}

export async function extractFileAsBlob(zip: JSZip, path: string): Promise<Blob | null> {
	const file = zip.file(path);
	if (!file) {
		return null;
	}
	return await file.async('blob');
}

export function listFilesInZip(zip: JSZip): string[] {
	return Object.keys(zip.files);
}

export function findFilesWithExtension(zip: JSZip, extension: string): string[] {
	return Object.keys(zip.files).filter(path => path.endsWith(extension));
}