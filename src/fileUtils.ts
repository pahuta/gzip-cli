import { join } from 'path';
import { accessSync, constants, mkdirSync, createReadStream, createWriteStream, ReadStream, WriteStream } from 'fs';
import * as glob from 'glob';
import { RunParameters } from './index';

export default class FileUtils {
  static getReadStream(filePath: string): ReadStream {
    return createReadStream(filePath);
  }

  static getWriteStream(filePath: string): WriteStream {
    return createWriteStream(filePath);
  }

  static getFilePathsFromGlob(pattern: string, runParams: RunParameters): Promise<string[]> {
    return new Promise((resolve, reject) => {
      glob(pattern, { ignore: runParams.ignorePatterns }, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  }

  static getOutputFilePath(filePath: string, runParams: RunParameters, globBase: string): string {
    const { outputDir } = runParams;

    return outputDir ? join(outputDir, filePath.slice(globBase.length)) : filePath;
  }

  static ensureOutputDir(outputDir: string) {
    try {
      accessSync(outputDir, constants.F_OK);
    } catch (err) {
      mkdirSync(outputDir);
    }
  }
}
