import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.definePreLoadCondition({
  name: 'createAccount',
  payload: 'payload',
  priority: 2,
}, (data, callback) => {
  log.info('PreLoad: AccountNameMustBeSupplied');
  if (!data.name || data.name.length < 2) {
    log.info(`Account name must be supplied ${data.name}`);
    return callback('Account name of more than 1 character must be supplied');
  }
  return callback(null);
});
