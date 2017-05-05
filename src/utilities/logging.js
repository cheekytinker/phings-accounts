import Logger from 'bunyan';
import fs from 'fs';
import path from 'path';
import appConfig from '../config/application';

const defaultLogDir = appConfig.app.logDir;

function createLogger(logFilePath) {
  return new Logger({
    name: `${appConfig.app.name}`,
    streams: [
      {
        level: appConfig.app.logLevel,
        path: logFilePath,
        type: 'rotating-file',
        period: '1d',
      },
    ],
  });
}

export default class Log {
  constructor(logFilePath) {
    this.logFilePath = logFilePath;
    if (!this.logFilePath) {
      this.logFilePath = path.join(defaultLogDir, `${appConfig.app.name}.log`);
    }
    if (!fs.existsSync(path.dirname(this.logFilePath))) {
      fs.mkdirSync(path.dirname(this.logFilePath));
    }
    this.log = createLogger(this.logFilePath);
  }

  info(message) {
    this.log.info(message);
  }

  warn(message) {
    this.log.warn(message);
  }

  error(message) {
    this.log.error(message);
  }
}

let applicationLog = null;

export const log = (() => {
  if (!applicationLog) {
    applicationLog = new Log();
  }
  return applicationLog;
})();
