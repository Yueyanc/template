import { inject, injectable } from 'inversify'
import { createServer } from 'electron-bridge-ipc/electron-main'
import { DisposableStore, ProxyChannel } from 'electron-bridge-ipc'
import { FileSystemService } from './FileSystemService'
import { WindowService } from './WindowService'
import { Logger, LoggerService } from './LoggerService'
import { ConfigStoreService } from './ConfigStoreService'

@injectable()
export class ChannelService {
  server = createServer()
  logger: Logger
  constructor(
    @inject(WindowService) private WindowService: WindowService,
    @inject(LoggerService) private LoggerService: LoggerService,
    @inject(LoggerService) private ConfigStoreService: ConfigStoreService,
  ) {
    this.logger = this.LoggerService.createLogger({
      logId: 'ChannelService',
      scope: 'ChannelService',
    })
    const disposables = new DisposableStore()
    this.server.registerChannel(
      'fileSystem',
      ProxyChannel.fromService(new FileSystemService(), disposables),
    )
    this.server.registerChannel(
      'window',
      ProxyChannel.fromService(this.WindowService, disposables),
    )
    this.server.registerChannel(
      'config',
      ProxyChannel.fromService(this.ConfigStoreService, disposables),
    )
    this.logger.log('Register Channel Finished')
  }
}
