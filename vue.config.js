const { defineConfig } = require('@vue/cli-service')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: isProduction ? '/v-hotkey/' : '',
  pages: {
    index: {
      entry: './src/docs/main',
      title: 'V-Hotkey',
      appMountId: 'app'
    }
  }
})
