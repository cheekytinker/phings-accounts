import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import shortid from 'shortid';
import redis from 'redis';
import appConfig from '../../../src/config/application';
import { cache, reset } from '../../../src/cacheProvider';
import mochaAsync from '../../helpers/mochaAsync';

const expect = chai.expect;
chai.use(dirtyChai);

describe('integration', () => {
  describe('cacheProvider', () => {
    describe('when initialised', () => {
      it('should prefix all keys with prefix in config', mochaAsync(async () => {
        const cacheClient = await cache();
        const key = shortid.generate();
        const expectedValue = shortid.generate();
        await cacheClient.set(key, expectedValue);
        const redisClient = redis.createClient(appConfig.app.cachePort, appConfig.app.cacheHost);
        return new Promise((resolve, reject) => {
          redisClient.get(`${appConfig.app.cachePrefix}${key}`, (err, value) => {
            if (err) {
              reject(err);
            }
            expect(value).to.equal(expectedValue);
            resolve();
          });
        });
      }));
      it('should only connect once', mochaAsync(async () => {
        await cache();
        await cache();
        await cache();
      }));
      it('should disconnect from redis when reset', () => {
        reset();
      });
      it('should quit redis connnection when closed', mochaAsync(async () => {
        const cacheClient = await cache();
        cacheClient.close();
        reset();
      }));
    });
  });
});
