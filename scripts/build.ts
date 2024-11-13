import { spawn } from 'node:child_process'
import { build } from 'vite'
import fse from 'fs-extra'

async function main() {
  await build({
    mode: 'production',
    configFile: 'apps/electron/vite.config.ts',
  })
  await build({
    mode: 'production',
    configFile: 'apps/electron/vite.preload.config.ts',
  })
  await build({
    mode: 'production',
    configFile: 'apps/web/vite.config.ts',
  })
  await fse.copy('apps/web/dist', 'apps/electron/app')
  spawn(
    process.platform.startsWith('win') ? 'pnpm.cmd' : 'pnpm',
    ['run', '--filter', 'electron', 'build'],
    { stdio: 'inherit' },
  )
}

main()
