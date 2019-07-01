const path = require('path');
const gzip = require('../src/index');
const FileUtils = require('./utils/fileUtils');
const config = require('./config');

describe('gzip files from API', () => {
    beforeEach(() => {
        return FileUtils.removeFolder(config.inputDir)
            .then(() => FileUtils.removeFolder(config.outputDir))
            .then(() => FileUtils.generateFile(config.generatedFilePath));
    });

    test('Check is gzip file created in the same folder', async () => {
        const outputFile = `${config.generatedFilePath}.gz`;
        const runParams = {
            patterns: [path.join(config.inputDir, '*.*')],
            outputExtension: 'gz'
        };
        const gzipPromise = gzip(runParams);

        await expect(gzipPromise.then(() => FileUtils.isExist(outputFile)))
            .resolves.toBeUndefined();
    });

    test('Check is gzip file created in a custom folder', async () => {
        const outputFile = path.join(config.outputDir, `${config.generatedFile}.gz`);
        const runParams = {
            patterns: [path.join(config.inputDir, '*.*')],
            outputDir: config.outputDir,
            outputExtension: 'gz'
        };
        const gzipPromise = gzip(runParams);

        await expect(gzipPromise.then(() => FileUtils.isExist(outputFile)))
            .resolves.toBeUndefined();
    });
});
