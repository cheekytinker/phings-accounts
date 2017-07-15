import path from 'path';
import { domain } from './domainWrapper';
import { log } from './utilities/logging';
import appConfig from './config/application';

let singleDomain = null;
const createDomain = () => {
  log.info('cqrsDomain requesting');
  if (singleDomain) {
    log.info('cqrsDomain already exists');
    return singleDomain;
  }
  log.info('cqrsDomain creating');
  const thePath = path.join(__dirname, 'domain');
  log.info(`cqrsDomain ${thePath}`);
  singleDomain = domain({
    domainPath: `${thePath}`,
    eventStore: {
      type: 'mongodb',
      host: appConfig.app.dbHost,                          // optional
      port: 27017,                                // optional
      dbName: appConfig.app.name,                           // optional
      eventsCollectionName: 'events',             // optional
      snapshotsCollectionName: 'snapshots',       // optional
      transactionsCollectionName: 'transactions', // optional
      timeout: 10000,                              // optional
    },
  });

  singleDomain.eventStore.on('connect', () => {
    log.info('eventStore connected');
  });

  singleDomain.eventStore.on('disconnect', () => {
    log.info('eventStore disconnected');
  });

  singleDomain.aggregateLock.on('connect', () => {
    log.info('aggregateLock connected');
  });

  singleDomain.aggregateLock.on('disconnect', () => {
    log.info('aggregateLock disconnected');
  });

  singleDomain.on('connect', () => {
    log.info('something connected');
  });

  singleDomain.on('disconnect', () => {
    log.info('something disconnected');
  });
  return singleDomain;
};

module.exports = {
  domain: createDomain,
  reset: () => {
    singleDomain = null;
  },
};
