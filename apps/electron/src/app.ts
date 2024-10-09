import { inject, injectable } from 'inversify'
import { ConfigStoreService } from './services/ConfigStoreService'
import { WindowService } from './services/WindowService'

@injectable()
export class Application {
  @inject(ConfigStoreService) ConfigStoreService!: ConfigStoreService
  @inject(WindowService) WindowService!: WindowService
  constructor() {}
}
