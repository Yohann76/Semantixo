const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: process.env.NODE_ENV === 'development' && process.env.DOCKER_ENV ? 8080 : 8081,
    host: '0.0.0.0',  // listen on all interfaces in Docker
    allowedHosts: 'all',  // external connections
    hot: true,  // Hot module replacement
    liveReload: true,  // Live reload
    watchFiles: {
      paths: ['src/**/*'],
      options: {
        usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
        interval: 1000,
        ignored: /node_modules/
      }
    }
  }
})
