import { injectable } from 'inversify'
import { createServer } from 'electron-bridge-ipc/electron-main'
import { DisposableStore, ProxyChannel } from 'electron-bridge-ipc'
import { FileSystemService } from './FileSystemService'

@injectable()
export class ChannelService {
  server = createServer()
  constructor() {
    const disposables = new DisposableStore()
    this.server.registerChannel(
      'fileSystem',
      ProxyChannel.fromService(new FileSystemService(), disposables),
    )
  }
}
