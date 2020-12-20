const path = require('path');
const HtmlWebpackPlugin  = require('html-webpack-plugin');  // Creates default web page (index.html)
const CleanWebpackPlugin = require('clean-webpack-plugin'); // Clears (removes) the given folders
const CopyWebpackPlugin  = require('copy-webpack-plugin');  // Copy files to output folder

module.exports = {
    mode: "development", // "production" | "development" | "none"
    entry: {
      myapp1: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      port:        5000
    },
    plugins: [
     // new HtmlWebpackPlugin({ title: 'My app'}),
        new CleanWebpackPlugin(['dist']), // <--- @warn: Clears `dist` folder
        new CopyWebpackPlugin([{ from: 'src/index.html', to: '' }]),
        new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }])
    ],
    output: {
      filename: '[name].bundle.js',   // myapp1.bundle.js // 'main.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader', // creates style nodes from JS strings
            'css-loader',   // translates CSS into CommonJS
            'sass-loader'   // compiles Sass to CSS, using Node Sass by default
          ]
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader',
            'less-loader'
          ]
        },
        {
         test: /\.(png|svg|jpg|gif)$/,
         use: [
           'file-loader'
         ]
       },
       {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
       }                
      ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    }
};