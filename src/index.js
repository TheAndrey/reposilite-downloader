import axios from "axios";
import {appendFile, writeFile} from "node:fs";
import {ALLOWED_FILE_EXTENSIONS, fileCallback, getFileExtension, removeBackslash} from "./utils.js";

async function main() {
	const repoUrl = removeBackslash(process.argv[2]);
	const outputFile = process.argv[3];

	if (process.argv.length < 4) {
		throw new Error('Usage: <REPO_URL> <OUTPUT_FILE>');
	}

	if (!repoUrl) throw new Error('No repository URL provided');
	if (!outputFile) throw new Error('No filename provided');

	try {
		const response = await fetchDetails(repoUrl, '/');
		console.log('Contents:', response);
	} catch (e) {
		console.error('Unable to fetch data. Is this really Reposilite?', e.message);
	}

	await writeFile(outputFile, '', fileCallback);

	scanRecursive(repoUrl, '/', outputFile);

	console.info('Done');
}

async function scanRecursive(repoUrl, path, file) {
	const response = await fetchDetails(repoUrl, path);
	path = removeBackslash(path);

	for (const item of response['files']) {
		if (item['type'] === 'DIRECTORY') {
			await scanRecursive(repoUrl, path + '/' + item['name'], file);

		} else if (item['type'] === 'FILE') {
			const ext = getFileExtension(item['name']);

			if (ALLOWED_FILE_EXTENSIONS.includes(ext)) {
				const url = repoUrl + path + '/' + item['name'];
				appendFile(file, url + "\n", {encoding: 'utf8'}, fileCallback);
			}

		} else {
			console.warn('Unknown item type:', item);
		}
	}
}

/**
 * @param {string} repoUrl
 * @param {string} path
 * @return {Promise<Object>}
 */
async function fetchDetails(repoUrl, path) {
	console.log('Fetching:', repoUrl + path);

	const response = await axios.get(repoUrl + '/api/maven/details' + path, {
		headers: {"Accept": "application/json"},
	});

	return response.data;
}

main();