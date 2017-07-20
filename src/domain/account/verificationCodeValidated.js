import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineEvent({
  name: 'verificationCodeValidated',
}, (data) => {
  log.info(`accountEmailVerified ${JSON.stringify(data)}`);
});
