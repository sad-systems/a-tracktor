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

    const plugins = cleanContent ? [
        new CleanWebpackPlugin([ contentBase ]), // <--- @warn: Clears the folder]
    ] : [];

    return {
        mode, // "production" | "development" | "none"
        entry: {
          // mylib: './src/index.js',
        },
        devtool: mode === 'development' ? 'inline-source-map' : false,
        devServer: {
            contentBase,
            port: 5000
        },
        plugins,
        output: {
            filename: '[name].bundle.js',   // <--- myapp1.bundle.js
            path: path.resolve(__dirname, contentBase)
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
            extensions: ['.tsx', '.ts', '.js']
        }
    }
};