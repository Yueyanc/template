import { inject, injectable } from 'inversify'
import { BrowserWindow, ipcMain, session } from 'electron'
import { ConfigStoreService } from './services/ConfigStoreService'
import { WindowManageService } from './services/WindowService'
import { ChannelService } from './services/ChannelService'
import { Logger, LoggerService } from './services/LoggerService'
import { TaryService } from './services/TaryService'

@injectable()
export class Application {
  @inject(ConfigStoreService) ConfigStoreService!: ConfigStoreService
  @inject(WindowManageService) WindowManageService!: WindowManageService
  @inject(ChannelService) ChannelService!: ChannelService
  @inject(TaryService) TaryService!: TaryService
  logger: Logger
  constructor(@inject(LoggerService) private LoggerService: LoggerService) {
    this.logger = this.LoggerService.createLogger({
      logId: 'Application',
      scope: 'Application',
    })
  }

  init() {
    ipcMain.handle('getConfig', (event) => {
      const win = BrowserWindow.fromWebContents(event.sender)
      return { WINDOW_ID: win?.id }
    })
  }

  setPermissionRequestHandler() {
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback, details) => {
      callback(true)
    },
    )
  }

  createMainWindow() {
    const mainWindow = this.WindowManageService.createWindow()
    if (process.env.VITE_DEV_SERVER_URL)
      mainWindow.window.loadURL(process.env.VITE_DEV_SERVER_URL)
  }
}
