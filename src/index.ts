import { createGzip, createBrotliCompress } from 'zlib';
import * as globParent from 'glob-parent';
import FileUtils from './fileUtils';
import GeneratorUtils from './generatorUtils';

export interface RunParameters {
  patterns: string[],
  ignorePatterns?: string[],
  outputDir?: string,
  outputExtensions?: string[]
}

const defaultParams: Partial<RunParameters> = {
  outputDir: null,
  outputExtensions: ['gz']
};

export function gzip(runParams: RunParameters): Promise<void> {
  const params = { ...defaultParams, ...runParams };

  if (params.outputDir) {
    FileUtils.ensureOutputDir(params.outputDir);
  }

  return GeneratorUtils.execute(handlePatterns(params));
}

function compressFile(filePath: string, outputFilePath: string, outputExtension: string | string[]): Promise<void> | Promise<void[]> {
  if (Array.isArray(outputExtension)) {
    return Promise.all(outputExtension.map(extension => compressFile(filePath, outputFilePath, extension) as Promise<void>));
  }

  const outputFilePathWitExtension = `${outputFilePath}.${outputExtension}`;
  const compressionMethod = outputExtension === 'br' ? createBrotliCompress : createGzip;

  return new Promise<void>(resolve => {
    FileUtils.getReadStream(filePath)
      .pipe(compressionMethod())
      .pipe(FileUtils.getWriteStream(outputFilePathWitExtension))
      .on('finish', resolve);
  });
}

function* handlePatterns(runParams: RunParameters): Generator<any, any, any> {
  for (let i = 0; i < runParams.patterns.length; i++) {
    yield* compressPattern(runParams.patterns[i], runParams);
  }
}

function* compressPattern(pattern: string, runParams: RunParameters): Generator<any, any, any> {
  const filePaths = yield FileUtils.getFilePathsFromGlob(pattern, runParams);
  const globBase = globParent(pattern);

  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    const outputFilePath = FileUtils.getOutputFilePath(filePath, runParams, globBase);
    yield compressFile(filePath, outputFilePath, runParams.outputExtensions);
  }
}
