import { describe, it, before, after, beforeEach, afterEach } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import errorCodes from '../../../../../src/utilities/errorCodes';
import * as precon from '../../../../../src/domain/account/accountAlreadyExists';
import * as ras from '../../../../../src/api/queries/readAccountSignup';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('domain', () => {
    describe('account', () => {
      describe('when account already exists preLoadCondition is run', () => {
        const command = {
          name: 'createAccount',
        };
        let stubRead = null;
        let sandbox = null;
        before(() => {
          sandbox = sinon.sandbox.create();
        });
        beforeEach(() => {
          stubRead = sandbox.stub(ras, 'default');
        });
        afterEach(() => {
          sandbox.restore();
          command.name = 'createAccount';
        });
        after(() => {
          if (sandbox) {
            sandbox.restore();
            sandbox = null;
          }
        });
        it('should be named after the command it applies to', () => {
          expect(precon.name).is.equal('createAccount');
        });
        it('should not raise an error if account does not exist in readDomain', (done) => {
          const key = 'myAccountName';
          stubRead.returns(Promise.reject({
            code: errorCodes.notFound,
            message: `Account signup not found for ${key}`,
          }));
          const data = {
            name: key,
            primaryContact: {
            },
          };
          const callback = (res) => {
            expect(res).to.be.null();
            done();
          };
          precon.preLoadConditionFn(data, callback);
        });
        it('should raise error if command is createAccount and accountSignup already exists', (done) => {
          const key = 'myAccountName';
          stubRead.returns(Promise.resolve({
            name: key,
          }));
          const data = {
            name: key,
            primaryContact: {
            },
          };
          const callback = (res) => {
            expect(res.message).to.equal('Account Already Exists');
            done();
          };
          precon.preLoadConditionFn(data, callback);
        });
      });
    });
  });
});
