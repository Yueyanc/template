import path from 'node:path'
import fs from 'node:fs'
import { injectable } from 'inversify'
import yaml from 'yaml'
import { writeFile } from 'atomically'

export const configPath = path.join(
  process.env.CONFIG_DIRECTORY!,
  'config.yaml',
)

@injectable()
export class ConfigStoreService {
  loadConfig(): any {
    if (fs.existsSync(configPath)) {
      return yaml.parse(fs.readFileSync(configPath, 'utf8'))
    }
    else {
      return {}
    }
  }

  async saveConfig(content: string): Promise<void> {
    await writeFile(configPath, content, { encoding: 'utf8' })
  }
}
