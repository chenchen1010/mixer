const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      preload: 'src/preload.js',
      builderOptions: {
        productName: "Video Mixer",
        appId: "com.videomixer.app",
        mac: {
          icon: "build/icon.icns"
        }
      },
      chainWebpackMainProcess: (config) => {
        config.target('electron-main')
      },
      chainWebpackRendererProcess: (config) => {
        config
          .target('web')
          .node
            .set('__dirname', false)
            .set('__filename', false)
      }
    }
  }
})
