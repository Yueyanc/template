import fse from 'fs-extra'
import type { IFileSystemService } from 'shared/interfaces/index'

export class FileSystemService implements IFileSystemService {
  async stat(source: string) {
    return fse.statSync(source)
  }
}
