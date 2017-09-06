const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, '../docs/src/main.js'),
  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader', 'eslint-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.md$/,
        use: ['html-loader', 'markdown-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: [/node_modules/, /md/]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: ['file-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../docs/src/template.html')
    })
  ]
}
