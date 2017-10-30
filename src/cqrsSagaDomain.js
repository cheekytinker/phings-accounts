import path from 'path';
import { sagaDomain } from './sagaDomainWrapper';
import { log } from './utilities/logging';
import appConfig from './config/application';

let singleSagaDomain = null;

const createSagaDomain = () => {
  log.info('cqrsSagaDomain requesting');
  if (singleSagaDomain) {
    log.info('cqrsSagaDomain already exists');
    return singleSagaDomain;
  }
  log.info('cqrsSagaDomain creating');
  const thePath = path.join(__dirname, '/sagas');
  singleSagaDomain = sagaDomain({
    sagaPath: thePath,
    sagaStore: {
      type: 'mongodb',
      host: appConfig.app.sagaDbHost,
      port: appConfig.app.sagaDbPort,                                // optional
      dbName: appConfig.app.sagaDbName,             // optional
      collectionName: 'sagas',                    // optional
      timeout: 10000,                              // optional
      // authSource: 'authedicationDatabase',        // optional
      // username: 'technicalDbUser',                // optional
      // password: 'secret'                          // optional
    },
  });
  singleSagaDomain.sagaStore.on('connect', () => {
    log.info('sagastore connected');
  });
  /* istanbul ignore next */
  singleSagaDomain.sagaStore.on('disconnect', /* istanbul ignore next */ () => {
    /* istanbul ignore next */
    log.info('sagastore disconnected');
  });
  singleSagaDomain.revisionGuardStore.on('connect', () => {
    log.info('revisionGuardStore connected');
  });
  /* istanbul ignore next */
  singleSagaDomain.revisionGuardStore.on('disconnect', /* istanbul ignore next */ () => {
    /* istanbul ignore next */
    log.info('revisionGuardStore disconnected');
  });
  singleSagaDomain.on('connect', () => {
    log.info('saga something connected');
  });
  /* istanbul ignore next */
  singleSagaDomain.on('disconnect', /* istanbul ignore next */ () => {
    /* istanbul ignore next */
    log.info('saga something disconnected');
  });
  return singleSagaDomain;
};

module.exports = {
  domain: createSagaDomain,
  reset: () => {
    singleSagaDomain = null;
  },
};
