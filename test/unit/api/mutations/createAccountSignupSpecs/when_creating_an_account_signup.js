import { describe, it, beforeEach, afterEach } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as d from '../../../../../src/cqrsDomain';
import createAccountSignup from '../../../../../src/api/mutations/createAccountSignup';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('api', () => {
    describe('mutations', () => {
      describe('accountSignupSpecs', () => {
        describe('when creating an accountSignup signup', () => {
          let stubHandle = null;
          const accountName = 'myaccount';
          const accountId = 'myaccount';
          const sandbox = sinon.sandbox.create();
          beforeEach(() => {
            const dm = {
              handle: () => {},
              getInfo: () => {},
            };
            const stubDomain = sandbox.stub(d.default, 'domain');
            stubDomain.returns(dm);
            stubHandle = sandbox.stub(dm, 'handle');
          });
          afterEach(() => {
            sandbox.restore();
          });
          it('should return expected fields if successful', (done) => {
            stubHandle.callsArgWith(
              1,
              null,
              null,
              {
                id: accountId,
                name: accountName,
                status: 'created',
              });
            createAccountSignup({
              input: {
                name: 'myAccount',
              },
            }).then((ret) => {
              expect(ret).deep.equal({
                id: accountId,
                name: accountName,
                status: 'created',
              });
              done();
            });
          });
          it('should error with message if error raised by handled', (done) => {
            stubHandle.callsArgWith(
              1,
              {
                name: 'A fake error',
                message: 'fake error details',
                more: '',
              },
              null,
              null);
            createAccountSignup({
              input: {
                name: 'myAccount',
              },
            }).catch((ret) => {
              expect(ret).deep.equal({
                name: 'A fake error',
                message: 'fake error details',
                more: '',
              });
              done();
            });
          });
        });
      });
    });
  });
});
