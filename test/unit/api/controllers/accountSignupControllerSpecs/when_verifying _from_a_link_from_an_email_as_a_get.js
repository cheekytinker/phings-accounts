import { describe, it, before, after } from 'mocha';
import sinon from 'sinon';
import * as vas from '../../../../../src/api/mutations/verifyAccountSignup';
import errorMessages from '../../../../../src/utilities/errorMessages';
import { friendlyVerifyAccountSignupRest } from '../../../../../src/api/controllers/accountSignupController';

describe('unit', () => {
  describe('api', () => {
    describe('accountSignupControllerSpecs', () => {
      describe('when verifying an account', () => {
        let req = null;
        let res = null;
        let next = null;
        let verifyAccountSignupStub = null;
        const sandbox = sinon.sandbox.create();
        const accountName = 'anaccount';
        const verificationCode = 'asd345';
        before(() => {
          verifyAccountSignupStub = sandbox.stub(vas, 'default');
          next = () => {};
          res = {
            json: () => {},
            status: () => {},
          };
          req = {
            swagger: {
              params: {
                key: {
                  value: accountName,
                },
                verificationCode: {
                  value: verificationCode,
                },
              },
            },
          };
        });
        after(() => {
          if (sandbox) {
            sandbox.restore();
          }
        });
        it('should return 200 if successful', (done) => {
          verifyAccountSignupStub.returns(Promise.resolve({
            key: accountName,
            name: accountName,
            status: 'awaitingVerification',
          }));
          const mock = sandbox.mock(res);
          mock.expects('status').once().withArgs(200);
          friendlyVerifyAccountSignupRest(req, res, next)
            .then(() => {
              mock.verify();
              done();
            });
        });
        it('should return 403 if account is not expecting verification', (done) => {
          // hmm not very idempotent
          verifyAccountSignupStub.returns(Promise.reject({
            name: errorMessages.ACCOUNT_VERIFICATION_NOT_EXPECTED,
            message: errorMessages.ACCOUNT_VERIFICATION_NOT_EXPECTED,
            more: null,
          }));
          const mock = sandbox.mock(res);
          mock.expects('status').once().withArgs(403);
          friendlyVerifyAccountSignupRest(req, res, next)
            .then(() => {
              mock.verify();
              done();
            });
        });
        it('should return 404 if account is not found', (done) => {
          verifyAccountSignupStub.returns(Promise.reject({
            name: errorMessages.ACCOUNT_NOT_FOUND,
            message: errorMessages.ACCOUNT_NOT_FOUND,
            more: null,
          }));
          const mock = sandbox.mock(res);
          mock.expects('status').once().withArgs(404);
          friendlyVerifyAccountSignupRest(req, res, next)
            .then(() => {
              mock.verify();
              done();
            });
        });
        it('should return 500 for any other error', (done) => {
          verifyAccountSignupStub.returns(Promise.reject({
            name: errorMessages.UNKNOWN_ERROR,
            message: errorMessages.UNKNOWN_ERROR,
            more: null,
          }));
          const mock = sandbox.mock(res);
          mock.expects('status').once().withArgs(500);
          friendlyVerifyAccountSignupRest(req, res, next)
            .then(() => {
              mock.verify();
              done();
            });
        });
      });
    });
  });
});
