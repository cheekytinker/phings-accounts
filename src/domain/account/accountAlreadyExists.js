import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineBusinessRule({
  name: 'accountAlreadyExists',
}, (changed, previous, events, command) => {
  log.info('Running Rule: accountAlreadyExists');
  if (previous.get('status') !== undefined && command.name === 'createAccount') {
    log.info('Rule Failed: accountAlreadyExists');
    throw new Error('Account already exists');
  }
});
