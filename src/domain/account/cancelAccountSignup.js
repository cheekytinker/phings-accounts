import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineCommand({
  name: 'cancelAccountSignup',
  existing: true,
}, (data, aggregate) => {
  log.info(`cancelAccountSignup agg: ${JSON.stringify(aggregate)}`);
  aggregate.apply('accountSignupCancelled');
});
