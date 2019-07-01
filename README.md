[![npm](https://img.shields.io/npm/v/gzip-cli.svg)](https://www.npmjs.com/package/gzip-cli)
[![npm](https://img.shields.io/npm/dm/gzip-cli.svg)](https://www.npmjs.com/package/gzip-cli)
[![Travis](https://img.shields.io/travis/pakhuta/gzip-cli.svg)](https://travis-ci.org/pakhuta/gzip-cli)
[![Coveralls github](https://img.shields.io/coveralls/github/pakhuta/gzip-cli.svg)](https://coveralls.io/github/pakhuta/gzip-cli?branch=master)


# gzip-cli
Provided ability to gzip files from npm script section. Also you can use it in your code as imported module.

### Install

```bash
npm i gzip-cli
```
### Command Line

```bash
Usage: gzip [glob patterns]

Options:
-o, --output               output directory
-e, --extension            output file extension (default=gz)
```

#### CLI example
```bash
gzip dist/**/*.js
```
Will gzip all `*.js` files in folder `dist` and output them to the same folder, e.g.

`dist/public/main.js` -> `dist/public/main.js.gz`

```bash
gzip source/**/*.js --output=dist
```
Will gzip all `*.js` files in folder `source` and output them to the `dist` folder with saving file paths relative to glob base, e.g.

`source/utils/fileUtils.js` -> `dist/utils/fileUtils.js.gz`

## gzip(patterns, [outputDir])

* `patterns` `{Array<String>}` Patterns to be matched
* `outputDir` `{String}` Output dir

### Code example
```javascript
const gzib = require('gzib');
gzip(['source/**/*.js'], 'dist');
```
Will gzip all `*.js` files in folder `source` and its sub-folders and output them to the `dist` folder with saving file paths relative to glob base, e.g.

`source/public/main.js` -> `dist/public/main.js.gz`
