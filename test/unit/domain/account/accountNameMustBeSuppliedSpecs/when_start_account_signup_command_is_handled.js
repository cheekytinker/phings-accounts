import { describe, it } from 'mocha';
import sinon from 'sinon';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import * as precon from '../../../../../src/domain/account/accountNameMustBeSupplied';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('domain', () => {
    describe('accountSignup', () => {
      describe('when start accountSignup signup command is handled', () => {
        it('should be named after the command it handles', () => {
          expect(precon.name).is.equal('startAccountSignup');
        });
        it('should error when name is less than 2 characters', () => {
          const data = {
            name: 'a',
          };
          const callback = sinon.spy();
          precon.preLoadConditionFn(data, callback);
          expect(callback.calledWith('Account name of more than 1 character must be supplied')).is.true();
        });
        it('should succeed when name greater than 1 character', () => {
          const data = {
            name: 'ab',
          };
          const callback = sinon.spy();
          precon.preLoadConditionFn(data, callback);
          expect(callback.calledWith(null)).is.true();
        });
      });
    });
  });
});
