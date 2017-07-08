import Logger from 'bunyan';
import consoleStream from 'bunyan-console-stream';
import fs from 'fs';
import path from 'path';
import appConfig from '../config/application';


const defaultLogDir = appConfig.app.logDir;
const consoleStreamOptions = {
  stderrThreshold: 40,
};

function createLogger(logFilePath, logLevel) {
  return new Logger({
    name: `${appConfig.app.name}`,
    streams: [
      {
        type: 'raw',
        stream: consoleStream.createStream(consoleStreamOptions),
        level: logLevel,
      },
      {
        level: logLevel,
        path: logFilePath,
        type: 'rotating-file',
        period: '1d',
      },
    ],
  });
}

export default class Log {
  constructor(logFilePath, logLevel) {
    this.logFilePath = logFilePath;
    this.logLevel = logLevel;
    if (!this.logFilePath) {
      this.logFilePath = path.join(defaultLogDir, `${appConfig.app.name}.log`);
    }
    if (!fs.existsSync(path.dirname(this.logFilePath))) {
      fs.mkdirSync(path.dirname(this.logFilePath));
    }
    this.log = createLogger(this.logFilePath, this.logLevel || appConfig.app.logLevel);
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
