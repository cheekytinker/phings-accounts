import Logger from 'bunyan';
import fs from 'fs';
import appConfig from '../config/application';

const logDir = appConfig.app.logDir;
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const log = new Logger({
  name: `${appConfig.app.name}`,
  streams: [
    {
      level: appConfig.app.logLevel,
      path: `${logDir}/${appConfig.app.name}.log`,
      type: 'rotating-file',
      period: '1d',
    },
  ],
});


export default log;
