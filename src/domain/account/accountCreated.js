import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';
import { cache, createKey } from '../../cacheProvider';
import { cacheKeys } from './cacheKeys';

module.exports = domain.defineEvent({
  name: 'accountCreated',
}, (data, aggregate) => {
  const inFiveMinutes = 60 * 5;
  try {
    (async () => {
      const client = await cache();
      await client.setWithExpiry(
        createKey(cacheKeys.ACCOUNT_RESERVED, data.name), 1, inFiveMinutes);
    })();
  } catch (err) {
    log.error(`Failed to send accountVerificationEmail ${err}`);
    throw new Error(err);
  }
  aggregate.set(data);
});
