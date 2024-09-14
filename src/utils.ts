export const ALLOWED_FILE_EXTENSIONS = ['jar', 'zip', 'pom', 'xml'];

export function removeBackslash(str: string): string {
	if (str.endsWith('/')) {
		return str.substring(0, str.length - 1);
	}
	return str;
}

export function getFileExtension(fileName: string): string {
	const dotAt = fileName.lastIndexOf('.');

	if (dotAt >= 0) {
		return fileName.substring(dotAt + 1);
	}

	return '';
}