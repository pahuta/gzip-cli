[![npm](https://img.shields.io/npm/v/gzip-cli.svg)](https://www.npmjs.com/package/gzip-cli)
[![npm](https://img.shields.io/npm/dm/gzip-cli.svg)](https://www.npmjs.com/package/gzip-cli)
[![Travis](https://img.shields.io/travis/pakhuta/gzip-cli.svg)](https://travis-ci.org/pakhuta/gzip-cli)
[![Coveralls github](https://img.shields.io/coveralls/github/pakhuta/gzip-cli.svg)](https://coveralls.io/github/pakhuta/gzip-cli?branch=master)


# gzip-cli
`gzip-cli` provides CLI for compressing files by using compress algorithms such as Gzip and Brotli.

### Install

```bash
npm i gzip-cli
```
## CLI usage
```bash
Usage: gzip [glob patterns]

Options:
-o, --output               output directory
-e, --extension            output file extension (default=gz). Also supported a few extensions in one command
```

#### CLI example
```bash
gzip dist/**/*.js
```
All `*.js` files in folder `dist` and its sub-folders will be compressed by Gzip algorithm and put them to the same folder, e.g.

```bash
gzip dist/**/*.js --extension=gz --extension=br
```
All `*.js` files in folder `dist` and its sub-folders will be compressed by Gzip and Brotli algorithm and put them to the same folder, e.g.
```bash
dist/public/main.js -> dist/public/main.js.gz
dist/public/main.js -> dist/public/main.js.br
```

```bash
gzip source/**/*.js --output=dist
```
All `*.js` files in folder `source` and its sub-folders will be compressed by Gzip algorithm and put them to the `dist` folder with saving file paths relative to a glob pattern base, e.g.
```
source/utils/fileUtils.js -> dist/utils/fileUtils.js.gz
```

#### CLI example of using in a "scripts" section of your package.json
Compress all `*.js` files in folder `dist`:
```bash
"scripts": {
  "gzip": "gzip dist/**/*.js"
}
```

Build Angular application and compress all `*.js` files in folder `dist`:
```bash
"scripts": {
  "build": "ng build && gzip dist/**/*.js"
}
```

Build React application and compress all `*.js` files in folder `build` by Gzip and Brotli algorithm:
```bash
"scripts": {
  "build": "react-scripts build && gzip build/**/*.js --extension=gz --extension=br"
}
```

## Module usage
### gzip(options)

* `options.patterns` `{String[]}` Array of patterns to be matched
* `outputDir` `{String} <optional>` Output dir
* `outputExtensions` `{String[]} <optional>` Array of output file extension. `br` - for Brotli algorithm, `gz` or others - for Gzip algorithm.

### Module example
`gzip-cli` can be used like a regular module:

```javascript
const gzip = require('gzip-cli').gzip;
gzip({patterns: ['dist/public/**/*.{html,css,js}'], outputExtensions: ['gz', 'br']});
```
All `*.html`, `*.css` and `*.js` files in folder `dist/public` and its sub-folders will be compressed by Gzip and Brotli algorithm and put them to the same folder, e.g.

```bash
dist/public/main.js -> dist/public/main.js.gz
dist/public/main.js -> dist/public/main.js.br
```

`gzip({...})` returns a promise which will be resolved when all resources will be compressed.

#### Module example of using in a Gulp task
```javascript
const gzip = require('gzip-cli').gzip;
gulp.task('compress-static-files', () => {
  return gzip({patterns: ['dist/public/**/*.{html,css,js}'], outputExtensions: ['gz', 'br']});
});
```
All `*.html`, `*.css` and `*.js` files in folder `dist/public` and its sub-folders will be compressed by Gzip and Brotli algorithm and put them to the same folder.

### Requirements

Node.js >= 12
