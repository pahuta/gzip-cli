const path = require('path');
const child_process = require('child_process');
const FileUtils = require('./utils/fileUtils');
const config = require('./config');

describe('gzip files from CLI', () => {
    beforeEach(() => {
        return FileUtils.removeFolder(config.inputDir)
            .then(() => FileUtils.removeFolder(config.outputDir))
            .then(() => FileUtils.generateFile(config.generatedFilePath));
    });

    test('Check is gzip file created in the same folder', (done) => {
        const outputFile = `${config.generatedFilePath}.gz`;
        const command = `node src/index.js ${path.join(config.inputDir, '*.*')}`;

        child_process.exec(command, {cwd: process.cwd()}, err => {
            if (err) {
                return;
            }
            FileUtils.isExist(outputFile).then(() => done());
        });
    });

    test('Check is gzip file created in a custom folder', (done) => {
        const outputFile = path.join(config.outputDir, `${config.generatedFile}.gz`);
        const command = `node src/index.js ${path.join(config.inputDir, '*.*')} --output=${config.outputDir}`;

        child_process.exec(command, {cwd: process.cwd()}, err => {
            if (err) {
                return;
            }
            FileUtils.isExist(outputFile).then(() => done());
        });
    });

    test('Check error message is pattern not defined', (done) => {
        const command = `node src/index.js`;

        child_process.exec(command, {cwd: process.cwd()}, (err, stdout, stderr) => {
            let isErrMsgOK = stderr === 'gzip: no one pattern is not specified. Operation is skipped.';

            if (!err && isErrMsgOK) {
                done();
            }
        });
    });
});
