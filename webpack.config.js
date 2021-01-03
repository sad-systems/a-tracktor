const webpackMerge        = require('webpack-merge');
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
});