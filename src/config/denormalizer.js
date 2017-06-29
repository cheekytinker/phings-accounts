import appConfig from './application';

const config = {
  denormalizerPath: `${__dirname}/../readDomain`,
  repository: {
    type: 'mongodb',
    host: appConfig.app.readDbHost,
    port: appConfig.app.readDbPort,
    dbName: appConfig.app.readDbName,
    timeout: 10000,
  },
  revisionGuard: {
    queueTimeout: 1000,
    queueTimeoutMaxLoops: 3,
    startRevisionNumber: 1,

    type: 'inmemory',
  },
};

export default config;
