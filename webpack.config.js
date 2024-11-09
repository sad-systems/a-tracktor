const CopyWebpackPlugin = require('copy-webpack-plugin'); // Copy files to output folder
const webpackMerge = require('webpack-merge');
const createWebpackConfig = require('./webpack.common.config');

/**
 * Configuration to build the library.
 */
module.exports = webpackMerge.merge(createWebpackConfig({ contentBase: 'dist' }), {
  entry: {
    lib: './src/lib.ts',
  },
  output: {
    library: 'atracktor',
    libraryTarget: 'umd',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'package.json', to: 'package.json' },
      { from: 'README.npm.md', to: 'README.md' },
      { from: 'LICENSE', to: '[name]' },
    ]),
  ],
});
