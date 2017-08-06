import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as evt from '../../../../../src/domain/account/accountActivated';
import statuses from '../../../../../src/domain/account/statuses';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('domain', () => {
    describe('account', () => {
      describe('accountActivatedSpecs', () => {
        describe('when an account is activated', () => {
          it('event should be named accountActivated', () => {
            expect(evt.name).to.equal('accountActivated');
          });
          it('should set the status of the account aggregate to active', () => {
            const data = {
            };
            const agg = {
              set: () => {
              },
            };
            const mockAgg = sinon.mock(agg);
            mockAgg.expects('set').once().withArgs('status', statuses.ACTIVE);
            evt.evtFn(data, mockAgg.object);
            mockAgg.verify();
          });
        });
      });
    });
  });
});
