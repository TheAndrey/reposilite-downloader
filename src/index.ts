import axios, {AxiosError} from "axios";
import {writeFile} from "node:fs";
import {ALLOWED_FILE_EXTENSIONS, getFileExtension, removeBackslash} from "./utils.js";
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

	const urls = await scanRecursive(repoUrl, '/', outputFile);

	writeFile(outputFile, urls.join("\n") + "\n", {encoding: 'utf8'}, err => {
		if (err) throw err;
	});

	console.info('Done');
}

async function scanRecursive(repoUrl: string, path: string, file: string): Promise<URL[]> {
	const response = await fetchDetails(repoUrl, path);
	const urls: URL[] = [];
	path = removeBackslash(path);

	for (const item of response.files) {
		if (item.type === 'DIRECTORY') {
			urls.push(...await scanRecursive(repoUrl, path + '/' + item.name, file));

		} else if (item.type === 'FILE') {
			const ext = getFileExtension(item.name);

			if (ALLOWED_FILE_EXTENSIONS.includes(ext)) {
				urls.push(new URL(repoUrl + path + '/' + item.name));
			}

		} else {
			console.warn('Unknown item type:', item);
		}
	}

	return urls;
}

async function fetchDetails(repoUrl: string, path: string): Promise<MavenIndex> {
	console.log('Fetching:', repoUrl + path);

	const response = await axios.get(repoUrl + '/api/maven/details' + path, {
		headers: {"Accept": "application/json"},
	});

	return response.data as MavenIndex;
}

main();