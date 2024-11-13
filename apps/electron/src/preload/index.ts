import { createPreload } from 'electron-bridge-ipc/electron-preload'
import { contextBridge, ipcRenderer } from 'electron'

const electronConst = {
  IN_ELECTRON: true,
}

if (process.contextIsolated) {
  createPreload()
  ipcRenderer.invoke('getConfig').then((res) => {
    contextBridge.exposeInMainWorld('ELECTRON_CONFIG', res)
  })
  contextBridge.exposeInMainWorld('ELECTRON_CONST', electronConst)
}
