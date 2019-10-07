
const HtmlWebpackTemplate = require('html-webpack-template')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/v-hotkey/' : '',
  pages: {
    index: {
      entry: './docs/src/main',
      title: 'V-Hotkey',
      template: HtmlWebpackTemplate,
      appMountId: 'app'
    }
  }
}
