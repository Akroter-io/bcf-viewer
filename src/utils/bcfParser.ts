import JSZip from 'jszip';
import { BCFData, BCFVersion, BCFProject, BCFExtensions, MarkupData, Markup } from '../types/bcf';
import { parseXMLString } from './xmlParser';

export async function parseMarkupFile(fileContent: string): Promise<Markup> {
	// Use the existing parseXMLString function instead of xml2js
	return parseXMLString(fileContent);
}

export function checkBCFVersion(versionContent: string): boolean {
	const versionRegex = /<VersionId>(\d+\.\d+)<\/VersionId>/;
	const match = versionContent.match(versionRegex);
	return match ? parseFloat(match[1]) >= 3.0 : false;
}

export async function parseBCFFile(file: File): Promise<BCFData> {
	console.log(`---start---`);
	const zip = new JSZip();
	const zipContent = await zip.loadAsync(file);

	// Parse version (but don't validate it)
	const versionFile = zipContent.file('bcf.version');
	let version: BCFVersion;
	if (versionFile) {
		const versionXml = await versionFile.async('string');
		version = parseVersion(versionXml);
	} else {
		// Provide default version if not found
		version = { VersionId: '3.0' };
	}

	// Parse project (optional)
	let project: BCFProject | undefined;
	const projectFile = zipContent.file('project.bcfp');
	if (projectFile) {
		const projectXml = await projectFile.async('string');
		project = parseProject(projectXml);
	}

	// Parse extensions (optional)
	let extensions: BCFExtensions | undefined;
	const extensionsFile = zipContent.file('extensions.xml');
	if (extensionsFile) {
		const extensionsXml = await extensionsFile.async('string');
		extensions = parseExtensions(extensionsXml);
	}

	// Parse topics
	const topics: MarkupData[] = [];

	// Find all GUID folders
	const guidFolders = Object.keys(zipContent.files)
		.filter(path => {
			const parts = path.split('/');
			return parts.length === 2 && parts[0].length > 0;
		})
		.map(path => path.split('/')[0])
		.filter((guid, index, array) => array.indexOf(guid) === index);
	console.log(guidFolders);

	for (const folderPath of guidFolders) {
		const topicId = folderPath.replace('/', '');
		const markupFile = zipContent.file(`${topicId}/markup.bcf`);

		if (markupFile) {
			console.log(`digging into markup file`);
			const markupXml = await markupFile.async('string');
			const markup = parseXMLString(markupXml);

			// Find images in the topic folder - improved image detection
			const images: string[] = [];

			// Debug: Log all files in the topic folder
			const allTopicFiles = Object.keys(zipContent.files).filter(path =>
				path.startsWith(`${topicId}/`) && !path.endsWith('/')
			);
			console.log(`Topic ${topicId} files:`, allTopicFiles);

			// Look for image files - more comprehensive search
			const imageFiles = Object.keys(zipContent.files).filter(path => {
				const isInTopic = path.startsWith(`${topicId}/`);
				const isNotDirectory = !path.endsWith('/');
				const lowerPath = path.toLowerCase();
				const isImage = lowerPath.endsWith('.png') ||
					lowerPath.endsWith('.jpg') ||
					lowerPath.endsWith('.jpeg') ||
					lowerPath.endsWith('.gif') ||
					lowerPath.endsWith('.bmp') ||
					lowerPath.endsWith('.tiff') ||
					lowerPath.endsWith('.tif');

				return isInTopic && isNotDirectory && isImage;
			});

			console.log(`Found ${imageFiles.length} image files for topic ${topicId}:`, imageFiles);

			for (const imagePath of imageFiles) {
				const imageFile = zipContent.file(imagePath);
				if (imageFile) {
					try {
						const imageArrayBuffer = await imageFile.async('arraybuffer');
						console.log(`Processing image ${imagePath}, size: ${imageArrayBuffer.byteLength} bytes`);

						// Determine MIME type from file extension
						const extension = imagePath.toLowerCase().split('.').pop();
						let mimeType = 'image/png'; // default
						switch (extension) {
							case 'jpg':
							case 'jpeg':
								mimeType = 'image/jpeg';
								break;
							case 'png':
								mimeType = 'image/png';
								break;
							case 'gif':
								mimeType = 'image/gif';
								break;
							case 'bmp':
								mimeType = 'image/bmp';
								break;
						}

						const imageBlob = new Blob([imageArrayBuffer], { type: mimeType });
						const imageUrl = URL.createObjectURL(imageBlob);
						images.push(imageUrl);
						console.log(`Created blob URL for ${imagePath}: ${imageUrl}`);
					} catch (error) {
						console.error(`Failed to process image ${imagePath}:`, error);
					}
				} else {
					console.warn(`Could not find file ${imagePath} in zip`);
				}
			}

			console.log(`Total images processed for topic ${topicId}: ${images.length}`);

			topics.push({
				markup,
				images,
				topicId
			});
		} else { console.log(`no markup.bcf found`); }
	}

	return {
		version,
		project,
		extensions,
		topics
	};
}

function parseVersion(xml: string): BCFVersion {
	const parser = new DOMParser();
	const doc = parser.parseFromString(xml, 'text/xml');
	const versionElement = doc.querySelector('Version');

	return {
		VersionId: versionElement?.getAttribute('VersionId') || '',
	};
}

function parseProject(xml: string): BCFProject {
	const parser = new DOMParser();
	const doc = parser.parseFromString(xml, 'text/xml');
	const projectElement = doc.querySelector('ProjectInfo Project');

	return {
		ProjectId: projectElement?.getAttribute('ProjectId') || '',
		Name: projectElement?.querySelector('Name')?.textContent || undefined
	};
}

function parseExtensions(xml: string): BCFExtensions {
	const parser = new DOMParser();
	const doc = parser.parseFromString(xml, 'text/xml');

	const getArrayFromElements = (selector: string): string[] => {
		const elements = doc.querySelectorAll(selector);
		return Array.from(elements).map(el => el.textContent || '');
	};

	return {
		TopicType: getArrayFromElements('TopicType'),
		TopicStatus: getArrayFromElements('TopicStatus'),
		Priority: getArrayFromElements('Priority'),
		TopicLabel: getArrayFromElements('TopicLabel'),
		Stage: getArrayFromElements('Stage'),
		UserIdType: getArrayFromElements('UserIdType')
	};
}

function isValidGuid(str: string): boolean {
	const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return guidRegex.test(str);
}