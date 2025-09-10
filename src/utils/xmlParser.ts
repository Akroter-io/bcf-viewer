import { Markup, Topic, Header, File, ViewPoint, Comment } from '../types/bcf';

export function parseXMLString(xmlString: string): Markup {
	const parser = new DOMParser();
	const doc = parser.parseFromString(xmlString, 'text/xml');

	// Check for parsing errors
	const errorNode = doc.querySelector('parsererror');
	if (errorNode) {
		throw new Error(`XML parsing failed: ${errorNode.textContent}`);
	}

	const markupElement = doc.querySelector('Markup');
	if (!markupElement) {
		throw new Error('Invalid markup XML: No Markup element found');
	}

	return {
		Header: parseHeader(doc),
		Topic: parseTopic(doc)
	};
}

function parseHeader(doc: Document): Header {
	const headerElement = doc.querySelector('Header');
	if (!headerElement) {
		throw new Error('No Header element found');
	}

	const fileElements = headerElement.querySelectorAll('File');
	const files: File[] = Array.from(fileElements).map(fileEl => ({
		IfcProject: fileEl.getAttribute('IfcProject') || '',
		Filename: fileEl.querySelector('Filename')?.textContent || '',
		Date: fileEl.querySelector('Date')?.textContent || ''
	}));

	return {
		Files: {
			File: files.length === 1 ? files[0] : files
		}
	};
}

function parseTopic(doc: Document): Topic {
	const topicElement = doc.querySelector('Topic');
	if (!topicElement) {
		throw new Error('No Topic element found');
	}

	const topic: Topic = {
		Guid: topicElement.getAttribute('Guid') || '',
		TopicType: topicElement.getAttribute('TopicType') || undefined,
		TopicStatus: topicElement.getAttribute('TopicStatus') || undefined,
		Title: topicElement.querySelector('Title')?.textContent || '',
		Priority: topicElement.querySelector('Priority')?.textContent || undefined,
		CreationDate: topicElement.querySelector('CreationDate')?.textContent || '',
		CreationAuthor: topicElement.querySelector('CreationAuthor')?.textContent || '',
		ModifiedDate: topicElement.querySelector('ModifiedDate')?.textContent || undefined,
		ModifiedAuthor: topicElement.querySelector('ModifiedAuthor')?.textContent || undefined,
		AssignedTo: topicElement.querySelector('AssignedTo')?.textContent || undefined
	};

	// Parse Labels
	const labelsElement = topicElement.querySelector('Labels');
	if (labelsElement) {
		const labelElements = labelsElement.querySelectorAll('Label');
		topic.Labels = Array.from(labelElements).map(label => label.textContent || '');
	}

	// Parse Comments
	const commentsElement = topicElement.querySelector('Comments');
	if (commentsElement) {
		const commentElements = commentsElement.querySelectorAll('Comment');
		if (commentElements.length > 0) {
			const comments: Comment[] = Array.from(commentElements).map(commentEl => ({
				Guid: commentEl.getAttribute('Guid') || '',
				Date: commentEl.querySelector('Date')?.textContent || '',
				Author: commentEl.querySelector('Author')?.textContent || '',
				Comment: commentEl.querySelector('Comment')?.textContent || '',
				ModifiedDate: commentEl.querySelector('ModifiedDate')?.textContent || undefined,
				ModifiedAuthor: commentEl.querySelector('ModifiedAuthor')?.textContent || undefined
			}));

			topic.Comments = {
				Comment: comments.length === 1 ? comments[0] : comments
			};
		}
	}

	// Parse Viewpoints
	const viewpointsElement = topicElement.querySelector('Viewpoints');
	if (viewpointsElement) {
		const viewpointElements = viewpointsElement.querySelectorAll('ViewPoint');
		if (viewpointElements.length > 0) {
			const viewpoints: ViewPoint[] = Array.from(viewpointElements).map(vpEl => ({
				Guid: vpEl.getAttribute('Guid') || '',
				Viewpoint: vpEl.querySelector('Viewpoint')?.textContent || undefined,
				Snapshot: vpEl.querySelector('Snapshot')?.textContent || undefined
			}));

			topic.Viewpoints = {
				ViewPoint: viewpoints.length === 1 ? viewpoints[0] : viewpoints
			};
		}
	}

	return topic;
}