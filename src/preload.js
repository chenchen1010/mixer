const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getFolderInfo: (path) => ipcRenderer.invoke('get-folder-info', path)
}) 