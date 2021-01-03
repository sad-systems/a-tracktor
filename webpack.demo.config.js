const CopyWebpackPlugin  = require('copy-webpack-plugin');  // Copy files to output folder
const webpackMerge       = require('webpack-merge');
const createWebpackConfig = require('./webpack.common.config');

/**
 * Configuration to build demo project.
 */
module.exports = webpackMerge.merge(createWebpackConfig({ contentBase: 'demo' }), {
    entry: {
        demo: './src/demo.js',
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/demo.html', to: 'index.html' },
            { from: 'src/assets/favicon.ico', to: 'favicon.ico' },
            { from: 'src/assets/sounds', to: 'assets/sounds' }
        ]),
    ],
});