import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron'
import { inject, injectable } from 'inversify'
import { Logger, LoggerService } from './LoggerService'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export interface WindowOptions {}
@injectable()
export class WindowService {
  logger: Logger
  windows: Window[] = []
  constructor(@inject(LoggerService) private LoggerService: LoggerService) {
    this.logger = this.LoggerService.createLogger({
      logId: 'WindowService',
      scope: 'WindowService',
    })
  }

  createWindow(options?: BrowserWindowConstructorOptions) {
    const defaultOptions: BrowserWindowConstructorOptions = {
      width: 900,
      height: 700,
      minWidth: 400,
      minHeight: 300,
      webPreferences: {
        preload: path.join(__dirname, 'preload.cjs'),
      },
    }
    const mergedOptions = Object.assign(defaultOptions, options)
    const window = new Window(mergedOptions)
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
