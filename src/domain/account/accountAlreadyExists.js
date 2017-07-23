import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';
import errorCodes from '../../utilities/errorCodes';
import readAccountSignup from '../../api/queries/readAccountSignup';

async function accountExists(key, callback) {
  try {
    const found = await readAccountSignup({ key });
    if (found) {
      callback(new domain.errors.BusinessRuleError('Account Already Exists'));
      return true;
    }
  } catch (err) {
    log.info(`Result of as read ${JSON.stringify(err)}`);
    if (err.code !== errorCodes.notFound) {
      log.error(err);
      callback(new Error(err));
    }
  }
  log.info('Return false');
  callback(null);
  return false;
}

module.exports = domain.definePreLoadCondition({
  name: 'createAccount',
  payload: 'payload',
  priority: 1,
}, (data, callback) => {
  log.info(`Running Pre Load Condition: accountAlreadyExists ${JSON.stringify(data)}`);
  if (!accountExists(data.name, callback)) {
    log.info('account does not exist');
  }
});
