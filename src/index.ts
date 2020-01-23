import { createGzip, createBrotliCompress } from 'zlib';
import * as globParent from 'glob-parent';
import * as parseArgs from 'minimist';
import FileUtils from './fileUtils';
import GeneratorUtils from './generatorUtils';

export interface IRunParameters {
  patterns: string[],
  outputDir?: string,
  outputExtensions?: string[]
}

interface IArgParams {
  _: string[];
  output: string;
  extension: string | string[];
}

export function gzip(runParams: IRunParameters): Promise<void> {
  if (runParams.outputDir) {
    FileUtils.ensureOutputDir(runParams.outputDir);
  }

  return GeneratorUtils.execute(handlePatterns(runParams));
}

function gzipFile(filePath: string, outputFilePath: string, outputExtension: string | string[]): Promise<void> | Promise<void[]> {
  if (Array.isArray(outputExtension)) {
    return Promise.all(outputExtension.map(extension => gzipFile(filePath, outputFilePath, extension) as Promise<void>));
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

function* handlePatterns(runParams: IRunParameters): Generator<any, any, any> {
  for (let i = 0; i < runParams.patterns.length; i++) {
    yield* gzipPattern(runParams.patterns[i], runParams);
  }
}

function* gzipPattern(pattern: string, runParams: IRunParameters): Generator<any, any, any> {
  const filePaths = yield FileUtils.getFilePathsFromGlob(pattern);
  const globBase = globParent(pattern);

  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    const outputFilePath = FileUtils.getOutputFilePath(filePath, runParams, globBase);
    yield gzipFile(filePath, outputFilePath, runParams.outputExtensions);
  }
}

function getArgv(): IArgParams {
  return parseArgs<IArgParams>(process.argv.slice(2), {
    alias: {
      output: 'o',
      extension: 'e'
    },
    string: ['output', 'extension'],
    default: {
      output: null,
      extension: 'gz'
    }
  });
}

function getRunParameters(): IRunParameters {
  const argv = getArgv();

  return {
    patterns: argv._,
    outputDir: argv.output,
    outputExtensions: Array.isArray(argv.extension) ? argv.extension : [argv.extension]
  };
}

function run() {
  if (module.parent) {
    return;
  }

  const runParams = getRunParameters();

  if (!runParams.patterns.length) {
    process.stderr.write('gzip-cli: no one pattern is specified. Operation is skipped.');
    return;
  }

  gzip(runParams);
}

run();
