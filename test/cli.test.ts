import { join } from 'path';
import { exec } from 'child_process';
import FileUtils from './utils/fileUtils';
import config from './config';

describe('gzip files from CLI', () => {
  beforeEach(async () => {
    await FileUtils.removeFolder(config.inputDir);
    await FileUtils.removeFolder(config.outputDir);
    await FileUtils.generateFile(config.generatedFilePath);
  });

  test('Check if gzip file created in the same folder', (done) => {
    const outputFile = `${config.generatedFilePath}.gz`;
    const command = `node dist/index.js ${join(config.inputDir, '*.*')}`;

    exec(command, { cwd: process.cwd() }, err => {
      if (err) {
        return;
      }
      FileUtils.isExist(outputFile).then(() => done());
    });
  });

  test('Check if gzip file created in a custom folder', (done) => {
    const outputFile = join(config.outputDir, `${config.generatedFile}.gz`);
    const command = `node dist/index.js ${join(config.inputDir, '*.*')} --output=${config.outputDir}`;

    exec(command, { cwd: process.cwd() }, err => {
      if (err) {
        return;
      }
      FileUtils.isExist(outputFile).then(() => done());
    });
  });

  test('Check error message if pattern is not defined', (done) => {
    const command = `node dist/index.js`;

    exec(command, { cwd: process.cwd() }, (err, _stdout, stderr) => {
      const isErrMsgOK = stderr.includes('gzip: no one pattern is specified. Operation is skipped.');
      if (!err && isErrMsgOK) {
        done();
      } else {
        throw new Error();
      }
    });
  });
});
