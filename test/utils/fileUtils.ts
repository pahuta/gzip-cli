import { access, accessSync, constants, createWriteStream, mkdirSync, WriteStream } from 'fs';
import { dirname } from 'path';
import { promisify } from 'util';
import * as rimraf from 'rimraf';

export default class FileUtils {
  static isExist(filePath: string): Promise<void> {
    return promisify(access)(filePath, constants.F_OK);
  }

  static getWriteStream(filePath: string): WriteStream {
    FileUtils.ensureDir(dirname(filePath));
    return createWriteStream(filePath);
  }

  static generateFile(filePath: string, mbSize = 1): Promise<void> {
    return new Promise((resolve, reject) => {
      const writableStream = FileUtils.getWriteStream(filePath);

      writableStream
        .write(Buffer.alloc(1024 * 1024 * mbSize), () => writableStream.end());

      writableStream.on('finish', resolve);
      writableStream.on('close', reject);
    });
  }

  static ensureDir(dir: string) {
    try {
      accessSync(dir, constants.F_OK);
    } catch (err) {
      mkdirSync(dir);
    }
  }

  static removeFolder(dir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      rimraf(dir, err => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }
};
