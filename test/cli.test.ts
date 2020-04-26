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

  test('Check if gzip file is created in the same folder', done => {
    const command = `node dist/cli.js ${join(config.inputDir, '*.*')}`;

    exec(command, { cwd: process.cwd() }, async err => {
      if (err) {
        return;
      }

      const isFileExist = await FileUtils.isExist(`${config.generatedFilePath}.gz`);
      expect(isFileExist).toBe(true);
      done();
    });
  });

  test('Check if gzip and brotli files are created in the same folder', done => {
    const command = `node dist/cli.js ${join(config.inputDir, '*.*')} --extension=br --extension=gz`;

    exec(command, { cwd: process.cwd() }, async err => {
      if (err) {
        return;
      }

      let isFileExist = await FileUtils.isExist(`${config.generatedFilePath}.gz`);
      expect(isFileExist).toBe(true);

      isFileExist = await FileUtils.isExist(`${config.generatedFilePath}.br`);
      expect(isFileExist).toBe(true);

      done();
    });
  });

  test('Check if gzip file is created in a custom folder', done => {
    const command = `node dist/cli.js ${join(config.inputDir, '*.*')} --output=${config.outputDir}`;

    exec(command, { cwd: process.cwd() }, async err => {
      if (err) {
        return;
      }

      const isFileExist = await FileUtils.isExist(join(config.outputDir, `${config.generatedFile}.gz`));
      expect(isFileExist).toBe(true);
      done();
    });
  });

  test('Check error message if pattern is not defined', done => {
    const command = `node dist/cli.js`;

    exec(command, { cwd: process.cwd() }, (err, _stdout, stderr) => {
      const isErrMsgOK = stderr.includes('gzip-cli: no one pattern is specified. Operation is skipped.');
      if (!err && isErrMsgOK) {
        done();
      } else {
        throw new Error();
      }
    });
  });
});
