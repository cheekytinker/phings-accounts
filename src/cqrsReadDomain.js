import denormalizer from 'cqrs-eventdenormalizer';
import config from './config/denormalizer';
import { log } from './utilities/logging';

const myDenormalizer = denormalizer(config);

myDenormalizer.repository.on('connect', () => {
  log.info('Repository connected');
});

myDenormalizer.repository.on('disconnect', () => {
  log.info('Repository disconnected');
});

myDenormalizer.revisionGuardStore.on('connect', () => {
  log.info('revisionGuardStore connected');
});

myDenormalizer.revisionGuardStore.on('disconnect', () => {
  log.info('revisionGuardStore disconnected');
});

module.exports = {
  readDomain: myDenormalizer,
};
