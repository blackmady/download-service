module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api':{
        target: 'http://172.16.20.172:9999/',
      },
      '/download':{
        target: 'http://172.16.20.172:9999/',
      }
    },
    overlay: {
      warnings: true,
      errors: true
    }
  }
}
