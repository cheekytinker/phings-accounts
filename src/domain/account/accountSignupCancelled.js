import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineEvent({
  name: 'accountSignupCancelled',
}, (data, aggregate) => {
  log.info(`destroying aggregate ${aggregate.id}`);
  aggregate.destroy();
});
