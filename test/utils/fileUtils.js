const fs = require('fs');
const path = require('path');
const util = require('util');
const rimraf = require('rimraf');

module.exports = class FileUtils {
    static isExist(filePath) {
        const access = util.promisify(fs.access);
        return access(filePath, fs.constants.F_OK);
    }

    static getWriteStream(filePath) {
        FileUtils.ensureDir(path.dirname(filePath));
        return fs.createWriteStream(filePath);
    }

    static generateFile(filePath, mbSize = 1) {
        return new Promise((resolve, reject) => {
            let writableStream = FileUtils.getWriteStream(filePath);

            writableStream
                .write(new Buffer(1024 * 1024 * mbSize), () => writableStream.end());

            writableStream.on('finish', resolve);
            writableStream.on('close', reject);
        });
    }

    static ensureDir(dir) {
        try {
            fs.accessSync(dir, fs.constants.F_OK);
        } catch (err) {
            fs.mkdirSync(dir);
        }
    }

    static removeFolder(dir) {
        return new Promise((resolve, reject) => {
            rimraf(dir, err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }

};
