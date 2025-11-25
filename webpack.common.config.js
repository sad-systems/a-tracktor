const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // Clears (removes) the given folders

/**
 * Function to return webpack.config
 *
 * @param {Object} props An object of {
 *                          contentBase: "./dist", // <--- The build dir
 *                       }
 *
 * @return {Object} webpack.config
 */
module.exports = (props) => {
  const {
    mode = process.env.NODE_ENV || 'development',
    contentBase = 'dist',
    cleanContent = true,
  } = props || {};

  const plugins = cleanContent
    ? [
        new CleanWebpackPlugin([contentBase]), // <--- @warn: Clears the folder]
      ]
    : [];

  return {
    mode, // "production" | "development" | "none"
    entry: {
      // mylib: './src/index.js',
    },
    devtool: mode === 'development' ? 'inline-source-map' : false,
    devServer: {
      static: contentBase,
      port: 5000,
    },
    plugins,
    output: {
      filename: '[name].bundle.js', // <--- myapp1.bundle.js
      path: path.resolve(__dirname, contentBase),
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader', // creates style nodes from JS strings
            'css-loader', // translates CSS into CommonJS
            'sass-loader', // compiles Sass to CSS, using Node Sass by default
            {
              loader: 'postcss-loader',
              options: { postcssOptions: { parser: 'postcss-scss' } },
            },
          ],
        },
        {
          // Insert images by link.
          test: /\.(png|svg|jpg|gif)$/,
          type: 'asset/resource',
          // use: ['file-loader'] // webpack v.4
        },
        {
          // Insert inline images (direct in HTML).
          test: /\.inline\.(png|svg|jpg|gif)$/,
          type: 'asset/inline',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          // use: ['file-loader'] // webpack v.4
        },
        {
          test: /\.html$/,
          loader: 'underscore-template-loader',
          // options: { engine: 'lodash' },
          exclude: /index\.html$/,
        },
        {
          test: /\.ts?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.pug$/,
          loader: 'pug-loader', // Normal loader, NOT suitable for VueJS!
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  };
};
