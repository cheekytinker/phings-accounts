import domain from 'cqrs-domain';
import { log } from '../../../utilities/logging';

module.exports = domain.defineBusinessRule({
  name: 'cannotStartTwice',
}, (changed, previous, events, command) => {
  if (previous.get('status') !== undefined && command.name === 'startAccountSignup') {
    log.info('cannotStartTwice');
    throw new Error('Cannot start signup twice');
  }
});
