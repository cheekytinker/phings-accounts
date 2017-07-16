import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineCommand({
  name: 'sendAccountVerificationEmail',
}, (data, aggregate) => {
  const theData = data;
  log.info(`sendAccountVerificationEmail data: ${JSON.stringify(theData)}`);
  log.info(`sendAccountVerificationEmail agg: ${JSON.stringify(aggregate)}`);
  aggregate.apply('accountVerificationEmailSent', {
    email: aggregate.get('primaryContact').email,
  });
});
