const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify"),
        "fs": false,
        "crypto": false
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      preload: 'src/preload.js',
      builderOptions: {
        productName: "Video Mixer",
        appId: "com.videomixer.app",
        win: {
          icon: "build/icon.ico",
          target: [
            {
              target: "nsis",
              arch: [
                "x64"
              ]
            }
          ]
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "Video Mixer",
          perMachine: true,
          include: "installer.nsh",
          installerIcon: "build/icon.ico",
          uninstallerIcon: "build/icon.ico",
          installerHeaderIcon: "build/icon.ico"
        },
        extraResources: [
          {
            from: "./resources/ffmpeg",
            to: "ffmpeg"
          }
        ],
        asar: true,
        files: [
          "**/*"
        ],
        mac: {
          target: []
        },
        linux: {
          target: []
        }
      },
      removeElectronJunk: false,
      productionSourceMap: true
    }
  }
})
