import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineBusinessRule({
  name: 'dontSendVerifcationEmailUnlessStatusCreated',
}, (changed, previous, events, command) => {
  log.info('Running Rule: dontSendVerifcationEmailUnlessStatusCreated');
  if (previous.get('status') !== 'created' && command.name === 'sendAccountVerificationEmail') {
    log.info('Rule Failed: Status not "created"');
    throw new Error('Cannot send email when status not "Created"');
  }
});
