const fs = require('fs');
const glob = require('glob');

class FileUtils {
    static getReadStream(filePath) {
        return fs.createReadStream(filePath);
    }

    static getWriteStream(filePath) {
        return fs.createWriteStream(filePath);
    }

    static getGzipedFilePath(filePath) {
        return `${filePath}.gz`;
    }

    static getFilePathsFromGlob(pattern) {
        return new Promise((resolve, reject) => {
            glob(pattern, (err, files) => (err) ? (reject(err)) : (resolve(files)));
        });
    }
}

module.exports = FileUtils;
