import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineEvent({
  name: 'verificationCodeRejected',
}, (data) => {
  log.info(`accountEmailVerified ${JSON.stringify(data)}`);
});
