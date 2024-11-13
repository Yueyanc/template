import { LogLevel, createServer } from 'vite'
import { setupMainPackageWatcher, setupPreloadPackageWatcher } from './watch'

/** @type 'production' | 'development'' */
const mode = (process.env.MODE = process.env.MODE || 'development')

const logLevel: LogLevel = 'info'
async function main() {
  const rendererWatchServer = await (
    await createServer({
      mode,
      logLevel,
      configFile: 'apps/web/vite.config.ts',
    })
  ).listen()
  rendererWatchServer.printUrls()
  await setupMainPackageWatcher(rendererWatchServer)
  await setupPreloadPackageWatcher(rendererWatchServer)
}

main()
