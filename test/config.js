const path = require('path');

module.exports = {
    inputDir: 'inputDir',
    outputDir: 'outputDir',
    generatedFile: 'source.js',
    get generatedFilePath() {
        return path.join(this.inputDir, this.generatedFile);
    }
};
