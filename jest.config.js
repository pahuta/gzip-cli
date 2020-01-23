const {defaults} = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],

  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.spec.json'
    }
  },
  coveragePathIgnorePatterns: [
    ...defaults.coveragePathIgnorePatterns,
    '/test/utils/',
    '/test/config.js'
  ]
};
