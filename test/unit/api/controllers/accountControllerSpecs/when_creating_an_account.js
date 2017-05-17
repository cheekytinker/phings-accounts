import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import { createAccount } from '../../../../../src/api/controllers/accountController';

chai.use(dirtyChai);

describe('unit', () => {
  describe('api', () => {
    describe('accountControllerSpecs', () => {
      describe('when creating an account', () => {
        const accountName = 'myaccount';
        const req = {
          body: {
            name: accountName,
          },
        };
        const res = {
          status: () => {},
          json: () => {},
        };
        const next = () => {};
        it('should return 201 if successful', () => {
          const mock = sinon.mock(res);
          mock.expects('status').once().withArgs(201);
          createAccount(req, res, next);
          mock.verify();
        });
        it('should set include message in response', () => {
          const mock = sinon.mock(res);
          mock.expects('json').once().withArgs({ message: `Account "${accountName}" created` });
          createAccount(req, res, next);
          mock.verify();
        });
      });
    });
  });
});
