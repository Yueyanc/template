import type { Stats } from 'fs-extra'
import { Event } from 'electron-bridge-ipc'

export interface IFileSystemService {
  stat: (path: string) => Promise<Stats>
}

export interface IWindowService {
  onMaximize: Event<number>
  onUnmaximize: Event<number>
  isMaximized: (id: number) => Promise<boolean>
  maximize: (id: number) => Promise<void>
  unmaximize: (id: number) => Promise<void>
  minimize: (id: number) => Promise<void>
  close: (id: number) => Promise<void>
}
