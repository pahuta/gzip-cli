const zlib = require('zlib');
const globParent = require('glob-parent');
const FileUtils = require('./fileUtils');
const GeneratorUtils = require('./generatorUtils');


async function run() {
    const destDir = process.argv.pop();
    const patterns = process.argv.slice(2);

    if (!patterns) {
        process.stderr.write('No one pattern is not specified.');
        process.exit(1);
    }

    if (!destDir) {
        process.stderr.write('Destination folder is not specified.');
        process.exit(1);
    }

    GeneratorUtils.execute(handlePatterns(patterns));
}

function gzipFile(filePath) {
    return new Promise(resolve => {
        let destFilePath = FileUtils.getGzipedFilePath(filePath);
        let readStream = FileUtils.getReadStream(filePath);
        let writeStream = FileUtils.getWriteStream(destFilePath);

        process.stdout.write(`stream "${filePath}" has been started\n`);

        readStream
            .pipe(zlib.createGzip())
            .pipe(writeStream)
            .on('finish', () => {
                resolve();
                process.stdout.write(`stream "${filePath}" has been ended\n`);
            });
    });
}

function* handlePatterns(patterns) {
    for (let i = 0; i < patterns.length; i++) {
        yield* gzipPattern(patterns[i]);
    }
}

function* gzipPattern(pattern) {
    let filePaths = yield FileUtils.getFilePathsFromGlob(pattern);

    for (let i = 0; i < filePaths.length; i++) {
        yield gzipFile(filePaths[i]);
    }
}

run();
