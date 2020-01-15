const HtmlWebpackTemplate = require('html-webpack-template')

const isProduction = process.env.NODE_ENV === 'production'

/** @type {import('@vue/cli-service').ProjectOptions} */
module.exports = {
  publicPath: isProduction ? '/v-hotkey/' : '',
  pages: {
    index: {
      entry: './src/docs/main',
      title: 'V-Hotkey',
      template: HtmlWebpackTemplate,
      inject: false,
      appMountId: 'app'
    }
  }
}
