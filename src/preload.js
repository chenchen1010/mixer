const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getFolderInfo: (path) => ipcRenderer.invoke('get-folder-info', path),
  selectOutputFolder: () => ipcRenderer.invoke('select-output-folder'),
  startMixing: (folders, outputPath, count) => ipcRenderer.invoke('start-mixing', folders, outputPath, count),
  onMixingProgress: (callback) => ipcRenderer.on('mixing-progress', (_event, value) => callback(value))
}) 