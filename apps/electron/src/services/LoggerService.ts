import { injectable } from 'inversify'
import log from 'electron-log/main'
import chalk from 'chalk'
import logSymbols from 'log-symbols'

log.initialize()

export interface Logger {
  log: (...values: any[]) => void
  warn: (...values: any[]) => void
  error: (...values: any[]) => void
}

interface CreateLoggerOptions {
  logId: string
  scope?: string
}

@injectable()
export class LoggerService {
  constructor() {}
  createLogger(options: CreateLoggerOptions) {
    const logger = log.create({ logId: options.logId })
    logger.transports.console.useStyles = true
    logger.transports.console.format = ({ message }) => {
      const prints = [chalk.green('Main')]

      switch (message.level) {
        case 'info':
          prints.push(logSymbols.info, chalk.blue('info'))
          break
        case 'warn':
          prints.push(logSymbols.warning, chalk.yellow('warning'))
          break
        case 'error':
          prints.push(logSymbols.error, chalk.bgRed('Error'))
          break
        default:
          break
      }
      prints.push(message.date.toLocaleString())
      if (message.scope)
        prints.push(chalk.gray(`[${message.scope}]`))
      prints.push('>', '\n')
      prints.push(...message.data)
      return prints
    }

    return options.scope ? logger.scope(options.scope) : logger
  }
}
