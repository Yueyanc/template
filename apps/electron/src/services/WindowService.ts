import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron'
import { inject, injectable } from 'inversify'
import { IWindowService } from 'shared/interfaces/index'
import { Emitter } from 'electron-bridge-ipc'
import { Logger, LoggerService } from './LoggerService'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

@injectable()
export class WindowService implements IWindowService {
  _onMaximize = new Emitter<number>()
  _onUnmaximize = new Emitter<number>()
  onMaximize = this._onMaximize.event
  onUnmaximize = this._onUnmaximize.event

  watchWindow(win: BrowserWindow) {
    win.on('maximize', () => {
      this._onMaximize.fire(win.id)
    })

    win.on('unmaximize', () => {
      this._onUnmaximize.fire(win.id)
    })
  }

  async isMaximized(id: number) {
    const win = BrowserWindow.fromId(id)
    return win?.isMaximized() || false
  }

  async maximize(id: number) {
    const win = BrowserWindow.fromId(id)
    return win?.maximize()
  }

  async unmaximize(id: number) {
    const win = BrowserWindow.fromId(id)
    return win?.unmaximize()
  }

  async minimize(id: number) {
    const win = BrowserWindow.fromId(id)
    return win?.minimize()
  }

  async close(id: number) {
    const win = BrowserWindow.fromId(id)
    return win?.close()
  }
}

export interface WindowOptions {}
@injectable()
export class WindowManageService {
  logger: Logger
  windows: Window[] = []
  @inject(WindowService)WindowService!: WindowService
  constructor(@inject(LoggerService) private LoggerService: LoggerService) {
    this.logger = this.LoggerService.createLogger({
      logId: 'WindowManageService',
      scope: 'WindowManageService',
    })
  }

  createWindow(options?: BrowserWindowConstructorOptions) {
    const defaultOptions: BrowserWindowConstructorOptions = {
      width: 900,
      height: 700,
      minWidth: 400,
      minHeight: 300,
      titleBarStyle: 'hidden',
      webPreferences: {
        preload: path.join(__dirname, 'preload.cjs'),
      },
    }
    const mergedOptions = Object.assign(defaultOptions, options)
    const window = new Window(mergedOptions)
    this.WindowService.watchWindow(window.window)
    this.windows.push(window)
    this.logger.log(`Create Window By`, mergedOptions)
    return window
  }
}

class Window {
  window: BrowserWindow
  constructor(options?: BrowserWindowConstructorOptions) {
    this.window = new BrowserWindow(options)
  }
}
