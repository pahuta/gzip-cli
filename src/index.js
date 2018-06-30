const zlib = require('zlib');
const globParent = require('glob-parent');
const FileUtils = require('./fileUtils');

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


    const filePaths = await FileUtils.getFilePaths(patterns);
    gzipFile(filePaths);
}

function gzipFile(filePaths, index = 0) {
    if (index === filePaths.length) {
        return;
    }

    let filePath = filePaths[index];
    let destFilePath = FileUtils.getGzipedFilePath(filePath);
    let readStream = FileUtils.getReadStream(filePath);
    let writeStream = FileUtils.getWriteStream(destFilePath);

    process.stdout.write(`stream ${index} has been started\n`);

    readStream
        .pipe(zlib.createGzip())
        .pipe(writeStream)
        .on('finish', () => {
            process.stdout.write(`stream ${index} has been ended\n`);
            gzipFile(filePaths, ++index);
        });
}

run();
