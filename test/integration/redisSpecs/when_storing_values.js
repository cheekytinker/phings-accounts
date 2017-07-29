import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import shortid from 'shortid';
import redis from 'redis';
import appConfig from '../../../src/config/application';
import { log } from '../../../src/utilities/logging';

const expect = chai.expect;
chai.use(dirtyChai);

describe('integration', () => {
  describe('redis', () => {
    describe('when storing values', () => {
      it('should connect', (done) => {
        const client = redis.createClient(appConfig.app.cachePort, appConfig.app.cacheHost);
        client.on('connect', () => {
          client.quit();
          done();
        });
      });
      it('should store a string value', (done) => {
        const client = redis.createClient(appConfig.app.cachePort, appConfig.app.cacheHost);
        client.on('connect', () => {
          const key = shortid.generate();
          const value = shortid.generate();
          client.set(key, value, () => {
            client.get(key, (err, data) => {
              expect(data).to.equal(value);
              done();
            });
          });
        });
      });
      it('should store a string value that expires', (done) => {
        const client = redis.createClient(appConfig.app.cachePort, appConfig.app.cacheHost);
        client.on('connect', () => {
          const key = shortid.generate();
          const value = shortid.generate();
          client.set(key, value, () => {
            client.get(key, (err, data) => {
              expect(data).to.equal(value);
              client.expire(key, 5);
              setTimeout(() => {
                client.get(key, (error, res) => {
                  if (error) {
                    log.info(`Key not found: ${JSON.stringify(error)} `);
                    done();
                    return;
                  }
                  done(res);
                });
              }, 6000);
            });
          });
        });
      }).timeout(20000);
    });
  });
});
