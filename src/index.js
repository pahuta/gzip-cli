const zlib = require('zlib');
const glob = require('glob');
const util = require('util');

function run() {
    const destDir = process.argv.pop();
    const patterns = process.argv.slice(2);

    if (!patterns) {
        process.stderr('No one pattern is not specified.');
        process.exit(1);
    }

    if (!destDir) {
        process.stderr('Destination folder is not specified.');
        process.exit(1);
    }

    const filePaths = [].concat(...patterns.map(async pattern => await getFilePathsByGlob(pattern)));
    filePaths.forEach(filePath => gzip(filePaths));
}

function getFilePathsByGlob(pattern) {
    return new Promise((resolve, reject) => {
        glob(pattern, (err, filePaths) => (err) ? (reject(err)) : (resolve(filePaths)));
    });
}

function gzip(filePath, options) {
    return new Promise((resolve, reject) => {
        zlib.gzip((filePath, options, (err, result) => (err) ? (reject(err)) : (resolve(result))));
    });
    return gzip(filePath, options);
}

run();
