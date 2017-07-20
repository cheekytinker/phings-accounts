import domain from 'cqrs-domain';
import { send } from '../../externalServices/smtpMessaging';
import { log } from '../../utilities/logging';

module.exports = domain.defineCommand({
  name: 'completeAccountSignup',
  existing: true,
}, (data, aggregate) => {
  log.info(`completeAccountSignup agg: ${JSON.stringify(aggregate)}`);
  const accountName = aggregate.get('name');
  try {
    (async () => {
      await send(
        'me@samples.mailgun.org',
        aggregate.get('primaryContact').email,
        `Phings Account ${accountName} Ready To Use`,
        `Thanks for verifying your email for account ${accountName}`,
        `Thanks for verifying your email for account ${accountName}`,
      );
    })();
  } catch (err) {
    log.error(`Failed to send accountVerificationEmail ${err}`);
    throw new Error(err);
  }
  aggregate.apply('accountSignupCompleted');
  aggregate.apply('accountActivated', {
    name: aggregate.get('name'),
    primaryContact: aggregate.get('primaryContact'),
    status: 'active',
  });
});
