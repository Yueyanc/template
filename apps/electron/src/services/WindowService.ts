import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron'
import { injectable } from 'inversify'

export interface WindowOptions {}
@injectable()
export class WindowService {
  windows: Window[] = []
  createWindow(options?: BrowserWindowConstructorOptions) {
    const defaultOptions: BrowserWindowConstructorOptions = {
      width: 900,
      height: 700,
      minWidth: 400,
      minHeight: 300,
    }
    const window = new Window(Object.assign(defaultOptions, options))
    this.windows.push(window)
    return window
  }
}

class Window {
  window: BrowserWindow
  constructor(options?: BrowserWindowConstructorOptions) {
    this.window = new BrowserWindow(options)
    if (process.env.VITE_DEV_SERVER_URL) {
      this.window.loadURL(process.env.VITE_DEV_SERVER_URL)
    }
  }
}
