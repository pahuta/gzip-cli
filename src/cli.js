#!/usr/bin/env node

const parseArgs = require('minimist');
const gzip = require('./index').gzip;

function getArgv() {
  return parseArgs(process.argv.slice(2), {
    alias: {
      output: 'o',
      extension: 'e',
      ignore: 'i'
    },
    string: ['output', 'extension', 'ignore'],
    default: {
      output: null,
      extension: ['gz'],
      ignore: []
    }
  });
}

function getRunParameters() {
  const argv = getArgv();

  return {
    patterns: argv._,
    ignorePatterns: Array.isArray(argv.ignore) ? argv.ignore : [argv.ignore],
    outputDir: argv.output,
    outputExtensions: Array.isArray(argv.extension) ? argv.extension : [argv.extension]
  };
}

function run() {
  const runParams = getRunParameters();

  if (!runParams.patterns.length) {
    process.stderr.write('gzip-cli: no one pattern is specified. Operation is skipped.');
    return;
  }

  gzip(runParams);
}

run();
