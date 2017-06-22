import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import * as account from './../../../../../src/domain/account/account';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('domain', () => {
    describe('account', () => {
      describe('when accountSignup aggregate defined', () => {
        it('should be named "accountSignup"', () => {
          expect(account[0].name).is.equal('account');
        });
        it('should require snapshot after 10 events', () => {
          const loadingTime = 10;
          let events = new Array(9);
          expect(account[0].isSnapshotNeeded(loadingTime, events)).is.false();
          events = new Array(10);
          expect(account[0].isSnapshotNeeded(loadingTime, events)).is.true();
        });
      });
    });
  });
});
