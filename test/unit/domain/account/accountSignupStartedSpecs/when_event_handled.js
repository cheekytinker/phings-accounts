import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as evt from '../../../../../src/domain/account/accountSignupStarted';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('domain', () => {
    describe('account', () => {
      describe('when event handled', () => {
        it('should be named accountSignupStarted', () => {
          expect(evt.name).to.equal('accountSignupStarted');
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
      });
    });
  });
});
