const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        // target: 'http://192.168.0.26:8001',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': ''
        // }
      },
      // '/another-api': {
      //   target: 'http://another-api.example.com',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/another-api': ''
      //   }
      }
      // 추가적인 URL 패턴에 대한 프록시 설정을 필요에 따라 추가할 수 있습니다.
  },
  configureWebpack: {
    devtool: 'source-map'
  }
})
