const {defaults} = require('jest-config');

module.exports = {
    coveragePathIgnorePatterns : [
        ...defaults.coveragePathIgnorePatterns,
        '/test/utils/',
        '/test/config.js'
    ]
};
