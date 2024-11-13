import { createClient, useService } from 'electron-bridge-ipc/electron-sandbox'
import { atom } from 'jotai'
import { IFileSystemService, IWindowService } from 'shared/interfaces/index'
import { IN_ELECTRON } from '@/utils/constants'

export const servicesAtom = atom(async () => {
  if (!IN_ELECTRON)
    return
  await createClient()
  const FileSystemService = useService<IFileSystemService>('fileSystem')
  const WindowService = useService<IWindowService>('window')
  return { FileSystemService, WindowService }
})

export const isMaximizedAtom = atom(false)
