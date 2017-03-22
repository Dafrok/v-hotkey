const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './docs/src/main.js',
    output: {
        path: path.resolve(__dirname, './'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/
            },
            {
                test: /\.md$/,
                loader: 'html-loader!markdown-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [/node_modules/, /md/]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './docs/src/template.html'
        })
    ]
};
