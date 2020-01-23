import { join } from 'path';
import { accessSync, constants, mkdirSync, createReadStream, createWriteStream, ReadStream, WriteStream } from 'fs';
import * as glob from 'glob';
import { IRunParameters } from './index';

export default class FileUtils {
  static getReadStream(filePath: string): ReadStream {
    return createReadStream(filePath);
  }

  static getWriteStream(filePath: string): WriteStream {
    return createWriteStream(filePath);
  }

  static getFilePathsFromGlob(pattern: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      glob(pattern, (err, files) => (err) ? (reject(err)) : (resolve(files)));
    });
  }

  static getOutputFilePath(filePath: string, runParams: IRunParameters, globBase: string): string {
    const { outputDir, outputExtension } = runParams;

    return outputDir ? (join(outputDir, `${filePath.slice(globBase.length)}.${outputExtension}`)) : (`${filePath}.${outputExtension}`);
  }

  static ensureOutputDir(outputDir: string) {
    try {
      accessSync(outputDir, constants.F_OK);
    } catch (err) {
      mkdirSync(outputDir);
    }
  }
}
