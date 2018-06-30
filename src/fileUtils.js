const fs = require('fs');
const glob = require('glob');

class FileUtils {
    static getReadStream(file) {
        let stream = fs.createReadStream(file);
        stream.on('error', process.stderr.write);
        return stream;
    }

    static getWriteStream(file) {
        let stream = fs.createWriteStream(file);
        stream.on('error', process.stderr.write);
        return stream;
    }

    static getGzipedFilePath(filePath) {
        return `${filePath}.gz`;
    }

    static getFilePathsFromGlob(pattern) {
        return new Promise((resolve, reject) => {
            glob(pattern, (err, files) => (err) ? (reject(err)) : (resolve(files)));
        });
    }

    static getFilePaths(patterns) {
        return Promise.all(patterns.map(pattern => FileUtils.getFilePathsFromGlob(pattern)))
            .then(filePaths => [].concat(...filePaths));
    }
}

module.exports = FileUtils;
