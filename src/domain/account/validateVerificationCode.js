import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineCommand({
  name: 'validateVerificationCode',
  existing: true,
}, (data, aggregate) => {
  log.info(`validateVerificationCode ${JSON.stringify(data)}`);
  if (data.submittedVerificationCode === data.expectedVerificationCode) {
    aggregate.apply('verificationCodeValidated', {
      email: aggregate.get('primaryContact').email,
    });
  } else {
    aggregate.apply('verificationCodeRejected', {
      email: aggregate.get('primaryContact').email,
    });
  }
});
