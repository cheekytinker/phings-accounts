import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineEvent({
  name: 'accountEmailVerificationCodeSubmitted',
}, (data) => {
  log.info(`accountEmailVerificationCodeSubmitted ${JSON.stringify(data)}`);
});
