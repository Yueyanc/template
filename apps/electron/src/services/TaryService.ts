import path from 'node:path'
import { Menu, Tray, app, nativeImage } from 'electron'
import { injectable } from 'inversify'

@injectable()
export class TaryService {
  tray?: Tray
  createTray() {
    this.tray = new Tray(nativeImage.createFromPath(path.join(app.getAppPath(), './resources/images/book.png')))
    const contextMenu = Menu.buildFromTemplate([
      { label: '显示', click() {
      } },
      { label: '退出', role: 'quit' },
    ])
    this.tray.setContextMenu(contextMenu)
  }
}
