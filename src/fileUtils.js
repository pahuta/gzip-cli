const fs = require('fs');

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
}

module.exports = FileUtils;
