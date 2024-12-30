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
            from: "./resources/ffmpeg/",
            to: "ffmpeg",
            filter: ["**/*"]
          }
        ],
        asar: true,
        files: [
          "**/*",
          "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
          "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
          "!**/node_modules/*.d.ts",
          "!**/node_modules/.bin",
          "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}",
          "!.editorconfig",
          "!**/._*",
          "!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}",
          "!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}",
          "!**/{appveyor.yml,.travis.yml,circle.yml}",
          "!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}"
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
