import { describe, it, beforeEach, afterEach } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as d from '../../../../../src/cqrsDomain';
import * as cqrsReadDomain from '../../../../../src/cqrsReadDomain';
import * as read from '../../../../../src/api/queries/readAccountSignup';
import verifyAccountSignup from '../../../../../src/api/mutations/verifyAccountSignup';
import mochaAsync from '../../../../helpers/mochaAsync';

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
              handle: () => {
              },
              getInfo: () => {
              },
            };
            accountSignupRepo = {
              findOne: () => {
              },
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
            const rd = sandbox.stub(read, 'default');
            rd.returns(Promise.resolve(accountId));
            const status = 'created';
            stubHandle.callsArgWith(
              1,
              null,
              null,
              {
                id: accountId,
                name: accountName,
                status,
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
                status,
              });
              done();
            }).catch((err) => {
              done(err);
            });
          });
          it('should error with message if error when reading account', (done) => {
            const rd = sandbox.stub(read, 'default');
            const expectedError = {
              name: 'A fake error',
              message: 'fake error details',
              more: '',
            };
            rd.returns(Promise.reject(expectedError));
            verifyAccountSignup({
              input: {
                key: 'myAccount',
                verificationCode: '12345',
              },
            }).catch((err) => {
              expect(err).deep.equal(expectedError);
              done();
            });
          });
          it('should reject the promise if submitAccountEmailVerificationCode errors', mochaAsync(async () => {
            const rd = sandbox.stub(read, 'default');
            rd.returns(Promise.resolve(accountId));
            const expectedError = {
              name: 'A fake error',
              message: 'fake error details',
              more: '',
            };
            stubHandle.callsArgWith(
              1,
              expectedError,
              null,
              null,
            );
            try {
              await verifyAccountSignup({
                input: {
                  key: 'myAccount',
                  verificationCode: '12345',
                },
              });
            } catch (err) {
              expect(err).to.equal(expectedError);
            }
          }));
        });
      });
    });
  });
});
