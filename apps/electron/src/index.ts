import { app } from 'electron'
import { ServiceContainer } from './inversify.config'
import { Application } from './app'
import 'reflect-metadata'

async function main() {
  const application = await ServiceContainer.getAsync<Application>(Application)
  application.init()
  app.whenReady().then(() => {
    application.setPermissionRequestHandler()
    application.TaryService.createTray()
    application.createMainWindow()
  })
}

main()
