import { join } from 'path';
import { gzip, IRunParameters } from '../src';
import FileUtils from './utils/fileUtils';
import config from './config';

describe('gzip files from API', () => {
  beforeEach(async () => {
    await FileUtils.removeFolder(config.inputDir);
    await FileUtils.removeFolder(config.outputDir);
    await FileUtils.generateFile(config.generatedFilePath);
  });

  test('Check if gzip file is created in the same folder', async () => {
    const runParams: IRunParameters = {
      patterns: [join(config.inputDir, '*.*')],
      outputDir: '',
      outputExtensions: ['gz']
    };

    await gzip(runParams);
    const isFileExist = await FileUtils.isExist(`${config.generatedFilePath}.gz`);

    expect(isFileExist).toBe(true);
  });

  test('Check if gzip and brotli files are created in the same folder', async () => {
    const runParams: IRunParameters = {
      patterns: [join(config.inputDir, '*.*')],
      outputDir: '',
      outputExtensions: ['gz', 'br']
    };

    await gzip(runParams);

    let isFileExist = await FileUtils.isExist(`${config.generatedFilePath}.gz`);
    expect(isFileExist).toBe(true);

    isFileExist = await FileUtils.isExist(`${config.generatedFilePath}.br`);
    expect(isFileExist).toBe(true);
  });

  test('Check if gzip file is created in a custom folder', async () => {
    const runParams: IRunParameters = {
      patterns: [join(config.inputDir, '*.*')],
      outputDir: config.outputDir,
      outputExtensions: ['gz']
    };

    await gzip(runParams);
    const isFileExist = await FileUtils.isExist(join(config.outputDir, `${config.generatedFile}.gz`));

    expect(isFileExist).toBe(true);
  });
});
