import denormalizer from 'cqrs-eventdenormalizer';
import config from './config/denormalizer';
import { log } from './utilities/logging';

let singleDenormalizer = null;
log.info('cqrsReadDomain initialising');
const myDenormalizer = () => {
  log.info('cqrsReadDomain requesting');
  if (singleDenormalizer) {
    log.info('cqrsReadDomain already exists');
    return singleDenormalizer;
  }
  log.info('cqrsReadDomain creating');
  singleDenormalizer = denormalizer(config);
  singleDenormalizer.repository.on('connect', () => {
    log.info('Repository connected');
  });

  singleDenormalizer.repository.on('disconnect', () => {
    log.info('Repository disconnected');
  });

  singleDenormalizer.revisionGuardStore.on('connect', () => {
    log.info('revisionGuardStore connected');
  });

  singleDenormalizer.revisionGuardStore.on('disconnect', () => {
    log.info('revisionGuardStore disconnected');
  });
  return singleDenormalizer;
};

export default {
  readDomain: myDenormalizer,
};
