import { join } from 'path';

const config = {
  inputDir: 'inputDir',
  outputDir: 'outputDir',
  generatedFile: 'source.js',
  get generatedFilePath() {
    return join(this.inputDir, this.generatedFile);
  }
};

export default config;
