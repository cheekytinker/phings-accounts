import { describe, it, beforeEach, afterEach } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as d from '../../../../../src/cqrsDomain';
import * as cqrsReadDomain from '../../../../../src/cqrsReadDomain';
import * as ras from '../../../../../src/api/queries/readAccountSignup';
import verifyAccountSignup from '../../../../../src/api/mutations/verifyAccountSignup';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('api', () => {
    describe('mutations', () => {
      describe('verifyAccountSignupSpecs', () => {
        describe('when verifying an accountSignup email', () => {
          let stubHandle = null;
          let accountSignupRepo = null;
          const accountName = 'myaccount';
          const accountId = '123456789';
          const sandbox = sinon.sandbox.create();
          beforeEach(() => {
            const dm = {
              handle: () => {},
              getInfo: () => {},
            };
            accountSignupRepo = {
              findOne: () => {},
            };
            const rd = {
              repository: {
                extend: () => accountSignupRepo,
              },
            };

            const stubRead = sandbox.stub(cqrsReadDomain.default, 'readDomain');
            stubRead.returns(rd);
            const stubDomain = sandbox.stub(d.default, 'domain');
            stubDomain.returns(dm);
            stubHandle = sandbox.stub(dm, 'handle');
          });
          afterEach(() => {
            sandbox.restore();
          });
          it('should return expected fields if successful', (done) => {
            const stubAccountSignupRepo = sandbox.stub(accountSignupRepo, 'findOne');
            stubAccountSignupRepo
              .callsArgWith(1, null, {
                attributes: {
                  id: accountId,
                  name: accountName,
                  status: 'created',
                },
              });
            stubHandle.callsArgWith(
              1,
              null,
              null,
              {
                id: accountId,
                name: accountName,
                status: 'created',
              });
            verifyAccountSignup({
              input: {
                key: 'myAccount',
                verificationCode: '12345',
              },
            }).then((ret) => {
              expect(ret).deep.equal({
                id: accountId,
                name: accountName,
                status: 'created',
              });
              done();
            }).catch((err) => {
              done(err);
            });
          });
          it('should error with message if account does not exist', (done) => {
            const stubAccountSignupRepo = sandbox.stub(accountSignupRepo, 'findOne');
            stubAccountSignupRepo
              .callsArgWith(1, null, null);
            stubHandle.callsArgWith(
              1,
              {
                name: 'A fake error',
                message: 'fake error details',
                more: '',
              },
              null,
              null);
            verifyAccountSignup({
              input: {
                name: 'myAccount',
              },
            }).catch((ret) => {
              expect(ret).deep.equal({
                code: 400,
                message: 'No key supplied',
              });
              done();
            });
          });
        });
      });
    });
  });
});
