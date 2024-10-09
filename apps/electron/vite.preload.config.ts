import { join } from 'node:path'
import type { UserConfig } from 'vite'

const PACKAGE_ROOT = __dirname
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..')

const config: UserConfig = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  build: {
    ssr: false,
    sourcemap: 'inline',
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: {
        preload: 'src/preload/index.ts',
      },
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['electron'],
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: false,
    reportCompressedSize: false,
  },
}

export default config
