import denormalizer from 'cqrs-eventdenormalizer';
import { log } from './../../utilities/logging';

module.exports = denormalizer.defineViewBuilder({
  name: 'accountSignupCompleted',
  aggregate: 'account',
  version: 0,
  id: 'aggregate.id',
  autoCreate: false,
  payload: 'payload',
  priority: 1,
}, (data, vm) => {
  log.info(`ReadDomain accountSignupCompleted ${JSON.stringify(data)}`);
  vm.set('status', 'completed');
});
