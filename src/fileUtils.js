const fs = require('fs');
const path = require('path');
const glob = require('glob');

class FileUtils {
    static getReadStream(filePath) {
        return fs.createReadStream(filePath);
    }

    static getWriteStream(filePath) {
        return fs.createWriteStream(filePath);
    }

    static getFilePathsFromGlob(pattern) {
        return new Promise((resolve, reject) => {
            glob(pattern, (err, files) => (err) ? (reject(err)) : (resolve(files)));
        });
    }

    static getOutputFilePath(filePath, outputDir, globBase) {
        return outputDir ? (path.join(outputDir, `${filePath.slice(globBase.length)}.gz`)) : (`${filePath}.gz`);
    }

    static ensureOutputDir(outputDir) {
        try {
            fs.accessSync(outputDir, fs.constants.F_OK);
        } catch (err) {
            fs.mkdirSync(outputDir);
        }
    }
}

module.exports = FileUtils;
