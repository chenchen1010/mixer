# Video Mixer

一个简单的视频混剪工具，可以从多个文件夹中随机选择视频进行混剪。

## 功能特点

- 支持选择多个视频文件夹
- 可以指定输出文件夹
- 支持设置输出视频数量
- 随机选择和打乱视频顺序
- 支持多种视频格式 (mp4, mov, avi, mkv)

## 安装说明

### 用户安装
1. 下载最新的安装包 `Video Mixer Setup.exe`
2. 运行安装程序，按提示完成安装
3. 从开始菜单或桌面快捷方式启动应用

### 开发环境搭建
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run electron:serve

# 打包应用
npm run electron:build -- --win
```

## Windows 打包注意事项

在开发过程中遇到的一些问题及解决方案：

### 1. FFmpeg 配置问题
- **问题**: 打包后提示 "Cannot find ffmpeg"
- **解决方案**: 
  1. 在项目根目录创建 `resources/ffmpeg` 文件夹
  2. 下载 Windows 版本的 FFmpeg
  3. 将 `ffmpeg.exe` 和 `ffprobe.exe` 放入 `resources/ffmpeg` 文件夹
  4. 在 `background.js` 中正确配置 FFmpeg 路径

```javascript
const ffmpegPath = app.isPackaged
  ? path.join(process.resourcesPath, 'ffmpeg', 'ffmpeg.exe')
  : 'ffmpeg'
```

### 2. 窗口显示问题
- **问题**: Windows 下应用窗口显示空白
- **解决方案**: 
  1. 移除 macOS 特定的窗口设置
  2. 使用标准窗口框架
  ```javascript
  win = new BrowserWindow({
    frame: true,
    backgroundColor: '#f5f5f7',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })
  ```

### 3. 打包配置问题
- **问题**: 资源文件未正确打包
- **解决方案**: 
  1. 在 `vue.config.js` 中配置 extraResources
  ```javascript
  extraResources: [
    {
      from: "./resources/ffmpeg/",
      to: "ffmpeg",
      filter: ["**/*"]
    }
  ]
  ```
  2. 启用 asar 打包
  ```javascript
  asar: true
  ```

### 4. Node.js 版本兼容性
- **问题**: Node.js 版本不兼容
- **解决方案**: 
  1. 在 `package.json` 中指定兼容的 Node.js 版本
  ```json
  "engines": {
    "node": "^16.0.0",
    "npm": "^8.0.0"
  }
  ```

## 使用说明

1. 启动应用
2. 点击"选择文件夹"，选择父文件夹，父文件夹中有多个子文件夹，子文件夹中有多个素材视频
3. 在预览区查看已选择的子文件夹中各有几个素材视频
4. 选择输出文件夹（可选）
5. 设置需要生成的视频数量
6. 点击"开始混剪"

## 注意事项

- 确保选择的文件夹中包含支持的视频格式
- 输出文件默认保存在桌面的 VideoMixer_Output 文件夹
- 混剪过程中请勿关闭应用

## 技术栈

- Electron
- Vue 3
- Element Plus
- FFmpeg

## 开发计划

- [ ] 添加视频预览功能
- [ ] 支持更多视频格式
- [ ] 添加视频转码选项
- [ ] 优化混剪进度显示

## License

MIT
