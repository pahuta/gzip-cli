![npm](https://img.shields.io/npm/v/gzip-cli.svg)

# gzip-cli
gzip files easily

### Install

```bash
npm i gzip-cli
```
### Command Line

```bash
  Usage: gzip [glob patterns]

  Options:
    -o, --output               output directory
```

### Example
```bash
  gzip dist/**/*.js
```
Will gzip all `*.js` files in folder `dist` and output they to the same folder, e.g.
`dist/public/main.js` -> `dist/public/main.js.gz`

```bash
  gzip source/**/*.js --output=dist
```
Will gzip all `*.js` files in folder `source` and output they to the `dist` folder with saving file paths relative to glob base, e.g.
`source/utils/fileUtils.js` -> `dist/utils/fileUtils.js.gz`
