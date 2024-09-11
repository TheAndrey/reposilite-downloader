# Reposilite downloader

This tool helps download the entire repositories of [Reposilite manager](https://reposilite.com/).

Reposilite repository manager uses a modern reactive frontend, so the traditional method of searching file URLs using wget does not work. This tool uses the Reposilite API to retrieve all file URLs.

## Usage

1. Clone or download ZIP of this repository.
2. Install NPM dependencies: `npm install`.
3. Run using command: `npm start -- https://repository-url.tld urls.txt` (_all found URLs will we written to urls.txt file_).
4. Pass URL list to wget: `wget --recursive --no-verbose -i urls.txt`
