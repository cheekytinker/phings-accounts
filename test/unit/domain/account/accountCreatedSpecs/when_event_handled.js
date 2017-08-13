import { describe, it, before, after } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as evt from '../../../../../src/domain/account/accountCreated';
import * as cache from '../../../../../src/cacheProvider';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('domain', () => {
    describe('account', () => {
      describe('accountCreatedSpecs', () => {
        describe('when event handled', () => {
          let sandbox = null;
          before(() => {
            sandbox = sinon.sandbox.create();
          });
          after(() => {
            if (sandbox) {
              sandbox.restore();
            }
          });
          it('should be named accountCreated', () => {
            expect(evt.name).to.equal('accountCreated');
          });
          it('should set the data on the account aggregate', () => {
            const data = {
              name: 'myName',
              status: 'created',
            };
            const agg = {
              set: () => {
              },
            };
            const mockAgg = sinon.mock(agg);
            mockAgg.expects('set').once().withArgs(data);
            evt.evtFn(data, mockAgg.object);
            mockAgg.verify();
          });
          it('should add entry into cache for account name to expire in 5 mins', () => {
            const accountName = 'fred123';
            const cacheKeyForAccountName = accountName;
            const mockCache = sandbox.mock(cache);
            const cacheClient = {
              setWithExpiry: () => {
              },
            };
            const inFiveMinutes = 60 * 5;
            const mockCacheClient = sandbox.mock(cacheClient);
            mockCacheClient
              .expects('setWithExpiry')
              .once()
              .withArgs(cacheKeyForAccountName, 1, inFiveMinutes)
              .returns(Promise.resolve());
            mockCache.expects('createKey').once().returns(cacheKeyForAccountName);
            mockCache.expects('cache').once().returns(Promise.resolve(cacheClient));
            const data = {
              name: accountName,
              status: 'created',
            };
            const agg = {
              set: () => {
              },
            };
            evt.evtFn(data, agg);
            mockCache.verify();
          });
        });
      });
    });
  });
});
