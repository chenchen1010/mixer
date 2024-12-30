'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'

const isDevelopment = process.env.NODE_ENV !== 'production'

// 保持window对象的全局引用，避免JavaScript对象被垃圾回收时，窗口被自动关闭。
let win

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: true,
    backgroundColor: '#f5f5f7',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 设置窗口标题
  win.setTitle('Video Mixer')

  // 打开开发者工具
  win.webContents.openDevTools()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    await win.loadURL('app://./index.html')
  }
}

// 当所有窗口都被关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// 应用程序准备就绪时创建窗口
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return result
})

ipcMain.handle('get-folder-info', async (event, folderPath) => {
  console.log('Reading folder:', folderPath)
  try {
    const items = await fs.promises.readdir(folderPath, { withFileTypes: true })
    console.log('Found items:', items)
    const subfolders = []

    for (const item of items) {
      if (item.isDirectory()) {
        const subfolder = {
          name: item.name,
          path: path.join(folderPath, item.name),
          videoCount: 0
        }
        
        // 获取子文件夹中的视频文件数量
        const files = await fs.promises.readdir(subfolder.path)
        subfolder.videoCount = files.filter(file => {
          const ext = path.extname(file).toLowerCase()
          return ['.mp4', '.mov', '.avi', '.mkv'].includes(ext)
        }).length

        subfolders.push(subfolder)
      }
    }

    console.log('Returning subfolders:', subfolders)
    return subfolders
  } catch (error) {
    console.error('Error reading directory:', error)
    throw error
  }
})

ipcMain.handle('select-output-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: '选择输出文件夹',
    buttonLabel: '选择输出位置'
  })
  return result
})

ipcMain.handle('start-mixing', async (event, folders, outputDir, count = 1) => {
  try {
    const results = []
    
    for (let i = 0; i < count; i++) {
      // 从每个文件夹中随机选择一个视频
      const selectedVideos = []
      for (const folder of folders) {
        const files = await fs.promises.readdir(folder.path)
        const videoFiles = files.filter(file => {
          const ext = path.extname(file).toLowerCase()
          return ['.mp4', '.mov', '.avi', '.mkv'].includes(ext)
        })
        
        if (videoFiles.length > 0) {
          const randomVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)]
          selectedVideos.push(path.join(folder.path, randomVideo))
        }
      }

      // 随机打乱视频顺序
      for (let i = selectedVideos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selectedVideos[i], selectedVideos[j]] = [selectedVideos[j], selectedVideos[i]]
      }

      if (selectedVideos.length === 0) {
        throw new Error('没有找到可用的视频文件')
      }

      // 使用指定的输出目录
      if (!outputDir) {
        outputDir = path.join(app.getPath('desktop'), 'VideoMixer_Output')
      }
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir)
      }

      const outputPath = path.join(outputDir, `mixed_${Date.now()}_${i + 1}.mp4`)

      // 创建一个临时文件列表
      const listPath = path.join(app.getPath('temp'), `video_list_${i}.txt`)
      const fileContent = selectedVideos.map(file => `file '${file}'`).join('\n')
      fs.writeFileSync(listPath, fileContent)

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(listPath)
          .inputOptions(['-f', 'concat', '-safe', '0'])
          .outputOptions('-c copy')
          .output(outputPath)
          .on('progress', progress => {
            win.webContents.send('mixing-progress', {
              percent: Math.round((progress.percent + i * 100) / count),
              timemark: progress.timemark
            })
          })
          .on('end', () => {
            fs.unlinkSync(listPath)
            resolve(outputPath)
          })
          .on('error', (err) => {
            if (fs.existsSync(listPath)) {
              fs.unlinkSync(listPath)
            }
            reject(err)
          })
          .run()
      })

      results.push(outputPath)
    }

    return results
  } catch (error) {
    console.error('混剪失败:', error)
    throw error
  }
}) 