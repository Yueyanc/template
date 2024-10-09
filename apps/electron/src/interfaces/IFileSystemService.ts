import type { Stats } from 'fs-extra'

export interface IFileSystemService {
  stat: (path: string) => Promise<Stats>
}
