import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineBusinessRule({
  name: 'cannotStartTwice',
}, (changed, previous, events, command) => {
  log.info(`Changed ${changed}`);
  log.info(`Status ${previous.get('status')}`);
  log.info(`Prev Name ${previous.get('name')}`);
  log.info(`Changed Name ${changed.get('name')}`);
  if (previous.get('status') !== undefined && command.name === 'startAccountSignup') {
    log.info('cannotStartTwice');
    throw new Error('Cannot start signup twice');
  }
});
