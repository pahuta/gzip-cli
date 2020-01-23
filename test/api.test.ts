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

  test('Check if gzip file created in the same folder', async () => {
    const outputFile = `${config.generatedFilePath}.gz`;
    const runParams: IRunParameters = {
      patterns: [join(config.inputDir, '*.*')],
      outputDir: '',
      outputExtension: 'gz'
    };

    await gzip(runParams);
    const isFileExist = await FileUtils.isExist(outputFile);

    expect(isFileExist).toBeUndefined();
  });

  test('Check if gzip file created in a custom folder', async () => {
    const outputFile = join(config.outputDir, `${config.generatedFile}.gz`);
    const runParams: IRunParameters = {
      patterns: [join(config.inputDir, '*.*')],
      outputDir: config.outputDir,
      outputExtension: 'gz'
    };

    await gzip(runParams);
    const isFileExist = await FileUtils.isExist(outputFile);

    expect(isFileExist).toBeUndefined();
  });
});
