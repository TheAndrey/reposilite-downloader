export const ALLOWED_FILE_EXTENSIONS = ['jar', 'zip', 'pom', 'xml'];

/**
 * @param {string} str
 * @return {string}
 */
export function removeBackslash(str) {
	if (str.endsWith('/')) {
		return str.substring(0, str.length - 1);
	}
	return str;
}

export function fileCallback(err) {
	if (err) {
		throw err;
	}
}

/**
 * @param {string} fileName
 * @return {null|string}
 */
export function getFileExtension(fileName) {
	const dotAt = fileName.lastIndexOf('.');

	if (dotAt >= 0) {
		return fileName.substring(dotAt + 1);
	}

	return null;
}