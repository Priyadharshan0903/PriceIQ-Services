export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.context}] ${message}`;
  }

  info(message: string, ...args: any[]) {
    console.log(this.formatMessage('INFO', message), ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(this.formatMessage('ERROR', message), ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(this.formatMessage('WARN', message), ...args);
  }

  debug(message: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }
}

export const createLogger = (context: string) => new Logger(context);
