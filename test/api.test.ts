import { join } from 'path';
import { gzip, RunParameters } from '../src';
import FileUtils from './utils/fileUtils';
import config from './config';

describe('gzip files from API', () => {
  beforeEach(async () => {
    await FileUtils.removeFolder(config.inputDir);
    await FileUtils.removeFolder(config.outputDir);
    await FileUtils.generateFile(config.generatedFilePath);
  });

  test('Check if gzip file is created in the same folder', async () => {
    const runParams: RunParameters = {
      patterns: [join(config.inputDir, '*.*')],
      outputExtensions: ['gz']
    };

    await gzip(runParams);
    const isFileExist = await FileUtils.isExist(`${config.generatedFilePath}.gz`);

    expect(isFileExist).toBe(true);
  });

  test('Check if gzip and brotli files are created in the same folder', async () => {
    const runParams: RunParameters = {
      patterns: [join(config.inputDir, '*.*')],
      outputExtensions: ['gz', 'br']
    };

    await gzip(runParams);

    let isFileExist = await FileUtils.isExist(`${config.generatedFilePath}.gz`);
    expect(isFileExist).toBe(true);

    isFileExist = await FileUtils.isExist(`${config.generatedFilePath}.br`);
    expect(isFileExist).toBe(true);
  });

  test('Check if gzip file is created in a custom folder', async () => {
    const runParams: RunParameters = {
      patterns: [join(config.inputDir, '*.*')],
      outputDir: config.outputDir,
      outputExtensions: ['gz']
    };

    await gzip(runParams);
    const isFileExist = await FileUtils.isExist(join(config.outputDir, `${config.generatedFile}.gz`));

    expect(isFileExist).toBe(true);
  });

  describe('ignore', () => {
    const ignoreFolder = 'node_modules';
    const skippedFilePaths = [
      join(join(config.inputDir, 'node_modules'), 'skippedFile_1.js'),
      join(join(config.inputDir, 'node_modules'), 'package_1', 'skippedFile_2.js')
    ];

    beforeEach(async () => {
      await Promise.all(skippedFilePaths.map(skippedFilePath => FileUtils.generateFile(skippedFilePath)));
    });

    test('should skip files if they match ignore pattern', async () => {
      const runParams: RunParameters = {
        patterns: [join(config.inputDir, '**/*.*')],
        ignorePatterns: [`**/${ignoreFolder}/**`],
        outputExtensions: ['gz']
      };

      await gzip(runParams);

      await expect(FileUtils.isExist(join(config.inputDir, `${config.generatedFile}.gz`))).resolves.toBe(true);
      await expect(FileUtils.isExist(skippedFilePaths[0])).resolves.toBe(true);
      await expect(FileUtils.isExist(skippedFilePaths[1])).resolves.toBe(true);
      await expect(FileUtils.isExist(`${skippedFilePaths[0]}.gz`)).resolves.toBe(false);
      await expect(FileUtils.isExist(`${skippedFilePaths[1]}.gz`)).resolves.toBe(false);
    });
  });
});
