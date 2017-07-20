import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineCommand({
  name: 'submitAccountEmailVerificationCode',
  existing: true,
}, (data, aggregate) => {
  log.info('submitAccountEmailVerificationCode');
  if (aggregate.get('status') !== 'awaitingVerification') {
    throw new Error('Account verification not expected');
  }
  aggregate.apply('accountEmailVerificationCodeSubmitted', {
    email: aggregate.get('primaryContact').email,
    verificationCode: data.verificationCode,
  });
});
