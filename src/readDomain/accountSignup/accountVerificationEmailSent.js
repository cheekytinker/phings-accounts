import denormalizer from 'cqrs-eventdenormalizer';
import { log } from './../../utilities/logging';

module.exports = denormalizer.defineViewBuilder({
  name: 'accountVerificationEmailSent',
  aggregate: 'account',
  version: 0,
  id: 'aggregate.id',
  autoCreate: true,
  payload: 'payload',
  priority: 1,
}, (data, vm) => {
  log.info(`ReadDomain accountVerificationEmailSent ${data}`);
  vm.set('status', data.status);
  vm.set('email', data.email);
});
