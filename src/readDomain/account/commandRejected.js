import denormalizer from 'cqrs-eventdenormalizer';
import { log } from '../../utilities/logging';

module.exports = denormalizer.defineViewBuilder({
  name: 'commandRejected',
  aggregate: 'account',
  version: 0,
  id: 'aggregate.id',
  autoCreate: false,
  payload: 'payload',
  priority: 1,
}, () => {
  log.info('Read domain command rejected');
});
