const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = env => {
  const isProductionBuild = env.NODE_ENV === 'production';

  return {
    target: 'node',
    mode: env.NODE_ENV,
    entry: './src/index.ts',
    devtool: isProductionBuild ? undefined : 'source-map',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: 'tsconfig.app.json'
              }
            }
          ],
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'commonjs'
    },
    externals: [nodeExternals()],
    plugins: [
      new CopyPlugin(['src/cli.js'])
    ]
  };
};
