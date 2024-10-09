import { app } from 'electron'
import { Container } from 'inversify'

process.env.CONFIG_DIRECTORY ??= app.getPath('userData')

export const ServiceContainer = new Container({
  autoBindInjectable: true,
  defaultScope: 'Singleton',
})
