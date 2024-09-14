import axios, {AxiosError} from "axios";
import {appendFile, writeFile} from "node:fs";
import {ALLOWED_FILE_EXTENSIONS, fileCallback, getFileExtension, removeBackslash} from "./utils.js";
import * as console from "node:console";
import {MavenIndex} from "./responses.js";

async function main() {
	if (process.argv.length < 4) {
		throw new Error('Usage: <REPO_URL> <OUTPUT_FILE>');
	}

	const repoUrl: string = removeBackslash(process.argv[2]);
	const outputFile: string = process.argv[3];
	if (!repoUrl) throw new Error('No repository URL provided');
	if (!outputFile) throw new Error('No filename provided');

	try {
		const response = await fetchDetails(repoUrl, '/');
		console.log('Contents:', response);
	} catch (e) {
		if (e instanceof AxiosError) {
			console.error('Unable to fetch data. Is this really Reposilite?', e.message);
			return;
		}
	}

	await writeFile(outputFile, '', fileCallback);

	scanRecursive(repoUrl, '/', outputFile);

	console.info('Done');
}

async function scanRecursive(repoUrl: string, path: string, file: string) {
	const response = await fetchDetails(repoUrl, path);
	path = removeBackslash(path);

	for (const item of response.files) {
		if (item.type === 'DIRECTORY') {
			await scanRecursive(repoUrl, path + '/' + item.name, file);

		} else if (item.type === 'FILE') {
			const ext = getFileExtension(item.name);

			if (ALLOWED_FILE_EXTENSIONS.includes(ext)) {
				const url = repoUrl + path + '/' + item.name;
				appendFile(file, url + "\n", {encoding: 'utf8'}, fileCallback);
			}

		} else {
			console.warn('Unknown item type:', item);
		}
	}
}

async function fetchDetails(repoUrl: string, path: string): Promise<MavenIndex> {
	console.log('Fetching:', repoUrl + path);

	const response = await axios.get(repoUrl + '/api/maven/details' + path, {
		headers: {"Accept": "application/json"},
	});

	return response.data as MavenIndex;
}

main();