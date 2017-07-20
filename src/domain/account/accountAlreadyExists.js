import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';
import readAccountSignup from '../../api/queries/readAccountSignup';

module.exports = domain.definePreLoadCondition({
  name: 'createAccount',
  payload: 'payload',
  priority: 1,
}, async (data, callback) => {
  log.info(`Running Pre Load Condition: accountAlreadyExists ${JSON.stringify(data)}`);
  try {
    const found = await readAccountSignup({ key: data.name });
    if (found) {
      log.info('Pre Load Condition Failed: accountAlreadyExists');
      callback(new domain.errors.BusinessRuleError('Account Already Exists'));
      return;
    }
  } catch (err) {
    log.error(err);
    callback(new Error(err));
    return;
  }
  callback(null);
});
