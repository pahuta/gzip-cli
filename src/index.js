const zlib = require('zlib');
const globParent = require('glob-parent');
const parseArgs = require('minimist');
const FileUtils = require('./fileUtils');
const GeneratorUtils = require('./generatorUtils');

function run() {
    const argv = getArgv();
    const outputDir = argv.output;
    const patterns = argv._;

    if (!patterns.length) {
        throw new Error('No one pattern is not specified.');
    }

    if (outputDir) {
        FileUtils.ensureOutputDir(outputDir);
    }

    GeneratorUtils.execute(handlePatterns(patterns, outputDir));
}

function gzipFile(filePath, outputFilePath) {
    return new Promise(resolve => {
        FileUtils.getReadStream(filePath)
            .pipe(zlib.createGzip())
            .pipe(FileUtils.getWriteStream(outputFilePath))
            .on('finish', resolve);
    });
}

function* handlePatterns(patterns, outputDir) {
    for (let i = 0; i < patterns.length; i++) {
        yield* gzipPattern(patterns[i], outputDir);
    }
}

function* gzipPattern(pattern, outputDir) {
    let filePaths = yield FileUtils.getFilePathsFromGlob(pattern);
    let globBase = globParent(pattern);

    for (let i = 0; i < filePaths.length; i++) {
        let filePath = filePaths[i];
        let outputFilePath = FileUtils.getOutputFilePath(filePath, outputDir, globBase);

        yield gzipFile(filePath, outputFilePath);
    }
}

function getArgv() {
    return parseArgs(process.argv.slice(2), {
        alias: {
            'output': 'o',
        },
        default: {
            output: null
        }
    });
}

run();
