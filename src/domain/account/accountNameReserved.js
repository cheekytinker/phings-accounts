import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';
import { cache, createKey } from '../../cacheProvider';
import cacheKeys from './cacheKeys';

async function accountNameReserved(key, callback) {
  try {
    const client = await cache();
    if (await client.get(createKey(cacheKeys.ACCOUNT_RESERVED, key))) {
      log.info(`Account name reserved ${key}`);
      callback(new domain.errors.BusinessRuleError('Account Name Reserved'));
      return true;
    }
  } catch (err) {
    log.error(err);
    callback(new Error(err));
  }
  callback();
  return false;
}

module.exports = domain.definePreLoadCondition({
  name: 'createAccount',
  payload: 'payload',
  priority: 1,
}, (data, callback) => {
  log.info(`Running Pre Load Condition: accountNameReserved ${JSON.stringify(data)}`);
  if (accountNameReserved(data.name, callback)) {
    log.info('Account name is reserved');
  }
});
