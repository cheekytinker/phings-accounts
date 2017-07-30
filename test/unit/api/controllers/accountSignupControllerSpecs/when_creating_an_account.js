import { describe, it, beforeEach, afterEach } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as cas from '../../../../../src/api/mutations/createAccountSignup';
import { createAccountSignupRest } from '../../../../../src/api/controllers/accountSignupController';

chai.use(dirtyChai);

describe('unit', () => {
  describe('api', () => {
    describe('controllers', () => {
      describe('accountSignupControllerSpecs', () => {
        describe('when creating an account', () => {
          let req = null;
          let res = null;
          let next = null;
          let stubCreateAccountSignup = null;
          const accountName = 'myaccount';
          const sandbox = sinon.sandbox.create();
          beforeEach(() => {
            req = {
              body: {
                name: accountName,
              },
            };
            res = {
              status: () => {
              },
              json: () => {
              },
            };
            next = () => {
            };
            stubCreateAccountSignup = sandbox.stub(cas, 'default');
          });
          afterEach(() => {
            if (sandbox) {
              sandbox.restore();
            }
          });
          it('should return 201 if successful', (done) => {
            stubCreateAccountSignup.returns(
              Promise.resolve({
                id: accountName,
                name: accountName,
                status: 'created',
              }),
            );
            const mock = sandbox.mock(res);
            mock.expects('status').once().withArgs(201);
            createAccountSignupRest(req, res, next)
              .then(() => {
                mock.verify();
                done();
              })
              .catch((err) => {
                done(err);
              });
          });
          it('should include message in response', (done) => {
            stubCreateAccountSignup.returns(
              Promise.resolve({
                id: accountName,
                name: accountName,
                status: 'created',
              }),
            );
            const mock = sandbox.mock(res);
            mock.expects('json').once().withArgs({
              message: `Account "${accountName}" created` });
            createAccountSignupRest(req, res, next)
              .then(() => {
                mock.verify();
                done();
              })
              .catch((err) => {
                done(err);
              });
          });
          it('should return 400 if domain errors when handling an error', (done) => {
            const myError = {
              name: 'Fake Error',
              message: 'An error',
              more: '',
            };
            stubCreateAccountSignup.returns(
              Promise.reject(myError),
            );
            const mock = sandbox.mock(res);
            mock.expects('status').once().withArgs(400);
            mock.expects('json').once().withArgs(
              sinon.match(obj => obj.message === `Error "${myError.message}"`));
            createAccountSignupRest(req, res, next)
              .then(() => {
                mock.verify();
                done();
              })
              .catch((err) => {
                done(err);
              });
          });
        });
      });
    });
  });
});
