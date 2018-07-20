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
        const gzipPromise = gzip([path.join(config.inputDir, '*.*')]);

        await expect(gzipPromise.then(() => FileUtils.isExist(outputFile)))
            .resolves.toBeUndefined();
    });

    test('Check is gzip file created in a custom folder', async () => {
        const outputFile = path.join(config.outputDir, `${config.generatedFile}.gz`);
        const gzipPromise = gzip([path.join(config.inputDir, '*.*')], config.outputDir);

        await expect(gzipPromise.then(() => FileUtils.isExist(outputFile)))
            .resolves.toBeUndefined();
    });
});
