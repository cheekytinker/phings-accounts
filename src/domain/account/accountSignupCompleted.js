import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineEvent({
  name: 'accountSignupCompleted',
}, (data, aggregate) => {
  log.info(`account signup completed ${aggregate.id}`);
});
