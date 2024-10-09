import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('_electron', {})
