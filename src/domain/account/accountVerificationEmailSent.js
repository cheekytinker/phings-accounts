import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineEvent({
  name: 'accountVerificationEmailSent',
}, (data, aggregate) => {
  log.info(`accountVerificationEmailSent agg:${JSON.stringify(aggregate)}`);
  aggregate.set('status', data.status);
});
