import { describe, it, beforeEach, afterEach } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as d from '../../../../../src/domainWrapper';
import { createAccountSignup } from '../../../../../src/api/controllers/accountSignupController';

chai.use(dirtyChai);

describe('unit', () => {
  describe('api', () => {
    describe('controllers', () => {
      describe('accountSignupControllerSpecs', () => {
        describe('when creating an accountSignup signup', () => {
          let req = null;
          let res = null;
          let next = null;
          let stubHandle = null;
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
            const dm = {
              handle: () => {},
              getInfo: () => {},
            };
            const stubDomain = sandbox.stub(d.default, 'domain');
            stubDomain.returns(dm);
            stubHandle = sandbox.stub(dm, 'handle');
          });
          afterEach(() => {
            if (sandbox) {
              sandbox.restore();
            }
          });
          it('should return 201 if successful', () => {
            stubHandle.callsArgWith(
              1,
              null,
              null,
              {
                id: accountName,
                name: accountName,
                status: 'created',
              },
              {
                aggregateId: accountName,
              });
            const mock = sandbox.mock(res);
            mock.expects('status').once().withArgs(201);
            createAccountSignup(req, res, next);
            mock.verify();
          });
          it('should set include message in response', () => {
            stubHandle.callsArgWith(
              1,
              null,
              null,
              {
                id: accountName,
                name: accountName,
                status: 'created',
              },
              {
                aggregateId: accountName,
              });
            const mock = sandbox.mock(res);
            mock.expects('json').once().withArgs({
              message: `Account signup "${accountName}" created` });
            createAccountSignup(req, res, next);
            mock.verify();
          });
          it('should return 400 if domain errors when handling an error', () => {
            const myError = {
              name: 'Fake Error',
              message: 'An error',
              more: '',
            };
            stubHandle.callsArgWith(
              1,
              myError,
              null,
              null,
              null);
            const mock = sandbox.mock(res);
            mock.expects('status').once().withArgs(400);
            mock.expects('json').once().withArgs(
              sinon.match(obj => obj.message === `Error "${myError.message}"`));
            createAccountSignup(req, res, next);
            mock.verify();
          });
        });
      });
    });
  });
});
