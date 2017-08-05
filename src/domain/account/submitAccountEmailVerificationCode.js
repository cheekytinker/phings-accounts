import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';
import errorMessages from '../../utilities/errorMessages';

module.exports = domain.defineCommand({
  name: 'submitAccountEmailVerificationCode',
  existing: true,
}, (data, aggregate) => {
  log.info('submitAccountEmailVerificationCode');
  if (aggregate.get('status') !== 'awaitingVerification') {
    throw new Error(errorMessages.ACCOUNT_VERIFICATION_NOT_EXPECTED);
  }
  aggregate.apply('accountEmailVerificationCodeSubmitted', {
    email: aggregate.get('primaryContact').email,
    verificationCode: data.verificationCode,
  });
});
