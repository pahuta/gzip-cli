#!/usr/bin/env node
const zlib = require('zlib');
const globParent = require('glob-parent');
const parseArgs = require('minimist');
const FileUtils = require('./fileUtils');
const GeneratorUtils = require('./generatorUtils');

function gzip(runParams) {
    if (runParams.outputDir) {
        FileUtils.ensureOutputDir(runParams.outputDir);
    }

    return GeneratorUtils.execute(handlePatterns(runParams));
}

function gzipFile(filePath, outputFilePath) {
    return new Promise(resolve => {
        FileUtils.getReadStream(filePath)
            .pipe(zlib.createGzip())
            .pipe(FileUtils.getWriteStream(outputFilePath))
            .on('finish', resolve);
    });
}

function* handlePatterns(runParams) {
    for (let i = 0; i < runParams.patterns.length; i++) {
        yield* gzipPattern(runParams.patterns[i], runParams);
    }
}

function* gzipPattern(pattern, runParams) {
    const filePaths = yield FileUtils.getFilePathsFromGlob(pattern);
    const globBase = globParent(pattern);

    for (let i = 0; i < filePaths.length; i++) {
        const filePath = filePaths[i];
        const outputFilePath = FileUtils.getOutputFilePath(filePath, runParams, globBase);
        yield gzipFile(filePath, outputFilePath);
    }
}

function getArgv() {
    return parseArgs(process.argv.slice(2), {
        alias: {
            'output': 'o',
            'extension': 'e'
        },
        string: ['output', 'extension'],
        default: {
            output: null,
            extension: 'gz'
        }
    });
}

function getRunParameters() {
    const argv = getArgv();

    return {
        patterns: argv._,
        outputDir: argv.output,
        outputExtension: argv.extension,
    };
}

function run() {
    if (module.parent) {
        return;
    }

    const runParams = getRunParameters();

    if (!runParams.patterns.length) {
        process.stderr.write('gzip: no one pattern is not specified. Operation is skipped.');
        return;
    }

    gzip(runParams);
}

run();

module.exports = gzip;
