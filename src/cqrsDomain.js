import domain from 'cqrs-domain';
import { log } from './utilities/logging';
import appConfig from './config/application';

const myDomain = domain({
  domainPath: `${__dirname}/domain`,
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

myDomain.eventStore.on('connect', () => {
  log.info('eventStore connected');
});

myDomain.eventStore.on('disconnect', () => {
  log.info('eventStore disconnected');
});

myDomain.aggregateLock.on('connect', () => {
  log.info('aggregateLock connected');
});

myDomain.aggregateLock.on('disconnect', () => {
  log.info('aggregateLock disconnected');
});

myDomain.on('connect', () => {
  log.info('something connected');
});

myDomain.on('disconnect', () => {
  log.info('something disconnected');
});

module.exports = {
  domain: myDomain,
};
