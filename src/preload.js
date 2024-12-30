const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getFolderInfo: (path) => ipcRenderer.invoke('get-folder-info', path),
  startMixing: (folders) => ipcRenderer.invoke('start-mixing', folders),
  onMixingProgress: (callback) => ipcRenderer.on('mixing-progress', (_event, value) => callback(value))
}) 