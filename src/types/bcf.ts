export interface BCFVersion {
	VersionId: string;
}

export interface BCFProject {
	ProjectId: string;
	Name?: string;
}

export interface BCFExtensions {
	TopicType?: string[];
	TopicStatus?: string[];
	Priority?: string[];
	TopicLabel?: string[];
	Stage?: string[];
	UserIdType?: string[];
}

export interface File {
	IfcProject: string;
	Filename: string;
	Date: string;
}

export interface Header {
	Files: {
		File: File | File[];
	};
}

export interface ViewPoint {
	Guid: string;
	Viewpoint?: string;
	Snapshot?: string;
}

export interface Comment {
	Guid: string;
	Date: string;
	Author: string;
	Comment: string;
	ModifiedDate?: string;
	ModifiedAuthor?: string;
}

export interface Topic {
	Guid: string;
	TopicType?: string;
	TopicStatus?: string;
	Title: string;
	Priority?: string;
	Labels?: string[];
	CreationDate: string;
	CreationAuthor: string;
	ModifiedDate?: string;
	ModifiedAuthor?: string;
	AssignedTo?: string;
	DocumentReferences?: any[];
	RelatedTopics?: any[];
	Comments?: {
		Comment?: Comment | Comment[];
	};
	Viewpoints?: {
		ViewPoint?: ViewPoint | ViewPoint[];
	};
}

export interface Markup {
	Header: Header;
	Topic: Topic;
}

export interface MarkupData {
	markup: Markup;
	images: string[];
	topicId: string;
}

export interface BCFData {
	version: BCFVersion;
	project?: BCFProject;
	extensions?: BCFExtensions;
	topics: MarkupData[];
}