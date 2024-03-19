const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: 'http://192.168.0.5:8000'
  },
  configureWebpack: {
    devtool: 'source-map'
  }
})
