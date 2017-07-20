import domain from 'cqrs-domain';
import { send } from '../../externalServices/smtpMessaging';
import { log } from '../../utilities/logging';
import config from '../../config/application';

module.exports = domain.defineCommand({
  name: 'sendAccountVerificationEmail',
  existing: true,
}, (data, aggregate) => {
  log.info(`sendAccountVerificationEmail ${JSON.stringify(data)}`);
  const accountName = aggregate.get('name');
  const link =
    `http://${config.app.restHost}:${config.app.restPort}/\
accountSignups/${accountName}/verification/${data.verificationCode}`;
  try {
    (async () => {
      await send(
        'me@samples.mailgun.org',
        aggregate.get('primaryContact').email,
        `Phings Account Signup for ${accountName}`,
        `Please verify your email for account ${accountName} by following this link: ${link}`,
        `<a href="${link}">Click here to verify your account ${accountName}</a>`,
      );
    })();
  } catch (err) {
    log.error(`Failed to send accountVerificationEmail ${err}`);
    throw new Error(err);
  }
  aggregate.apply('accountVerificationEmailSent', {
    email: aggregate.get('primaryContact').email,
    status: 'awaitingVerification',
  });
});
