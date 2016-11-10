const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: { path: path.join(__dirname, 'public'), filename: 'scripts/bundle.js' },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'stage-0', 'react']
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style", "css!postcss!sass")
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style", "css", "postcss")
            }
        ]
    },
    sassLoader: {
        includePaths: [path.resolve(__dirname, "./src")]
    },
    plugins: [
        new ExtractTextPlugin("styles/style.css")
        // new webpack.ProvidePlugin({
        //     '$': 'jquery/dist/jquery.min',
        //     'jQuery': 'jquery/dist/jquery.min',
        //     'window.jQuery': 'jquery/dist/jquery.min'
        // })
    ],
    postcss: [
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.scss', '.css'],
        root: [path.join(__dirname, './src')]
    }
};