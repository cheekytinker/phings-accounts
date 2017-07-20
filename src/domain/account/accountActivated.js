import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineEvent({
  name: 'accountActivated',
}, (data, aggregate) => {
  log.info(`account activated ${aggregate.id}`);
  aggregate.set('status', 'active');
});
