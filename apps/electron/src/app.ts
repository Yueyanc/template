import { inject, injectable } from 'inversify'
import { ConfigStoreService } from './services/ConfigStoreService'
import { WindowService } from './services/WindowService'
import { ChannelService } from './services/ChannelService'

@injectable()
export class Application {
  @inject(ConfigStoreService) ConfigStoreService!: ConfigStoreService
  @inject(WindowService) WindowService!: WindowService
  @inject(ChannelService) ChannelService!: ChannelService
  constructor() {}
  createMainWindow() {
    const mainWindow = this.WindowService.createWindow()
    if (process.env.VITE_DEV_SERVER_URL)
      mainWindow.window.loadURL(process.env.VITE_DEV_SERVER_URL)
  }
}
