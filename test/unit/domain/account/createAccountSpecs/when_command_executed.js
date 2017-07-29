import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as cmd from '../../../../../src/domain/account/createAccount';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('domain', () => {
    describe('createAccount', () => {
      describe('when command executed', () => {
        it('should be named "createAccount"', () => {
          expect(cmd.name).to.equal('createAccount');
        });
        it('should set status to be "created"', () => {
          const data = {
            name: 'myName',
          };
          const agg = {
            apply: () => {},
          };
          cmd.cmdFn(data, agg);
          expect(data.status).to.equal('created');
        });
        it('should apply "accountCreated" event to aggregate with data', () => {
          const data = {
            name: 'myName',
          };
          const agg = {
            apply: () => {},
          };
          const expectedEventDataToApply = data;
          expectedEventDataToApply.status = 'created';
          const mockAgg = sinon.mock(agg);
          const nameOfEventToApply = 'accountCreated';
          mockAgg.expects('apply').withArgs(nameOfEventToApply, expectedEventDataToApply);
          cmd.cmdFn(data, mockAgg.object);
          mockAgg.verify();
        });
      });
    });
  });
});
