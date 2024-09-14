export type FileType = "FILE"|"DIRECTORY";

export interface MavenIndex {
	name: string;
	type: FileType;
	files: MavenFile[];
}

export interface MavenFile {
	name: string;
	type: FileType;
	contentType?: string;
	contentLength?: string;
}