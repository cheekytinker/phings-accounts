import denormalizer from 'cqrs-eventdenormalizer';
import { log } from './../../utilities/logging';

module.exports = denormalizer.defineViewBuilder({
  name: 'accountCreated',
  aggregate: 'account',
  version: 0,
  id: 'aggregate.id',
  autoCreate: true,
  payload: 'payload',
  priority: 1,
}, (data, vm) => {
  log.info(`ReadDomain AccountCreated ${data}`);
  vm.set('name', data.name);
  vm.set('primaryContact', data.primaryContact);
  vm.set('status', data.status);
});
