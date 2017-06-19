import denormalizer from 'cqrs-eventdenormalizer';
import { log } from './../../utilities/logging';

module.exports = denormalizer.defineViewBuilder({
  name: 'accountSignupStarted',
  aggregate: 'accountSignup',
  version: 0,
  id: 'aggregate.id',
  autoCreate: true,
  payload: 'payload',
  priority: 1,
}, (data, vm) => {
  log.info(`ReadDomain AccountSignupStarted ${data}`);
  log.info(`ReadDomain AccountSignupStarted creating ${data}`);
  vm.set('name', data.name);
  vm.set('status', data.status);
});
