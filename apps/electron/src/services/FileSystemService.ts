import fse from 'fs-extra'
import { IFileSystemService } from '../interfaces/IFileSystemService'

export class FileSystemService implements IFileSystemService {
  async stat(source: string) {
    return fse.statSync(source)
  }
}
