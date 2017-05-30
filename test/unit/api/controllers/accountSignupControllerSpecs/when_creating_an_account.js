import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import { createAccountSignup } from '../../../../../src/api/controllers/accountSignupController';

chai.use(dirtyChai);

describe('unit', () => {
  describe('api', () => {
    describe('controllers', () => {
      describe('accountSignupControllerSpecs', () => {
        describe('when creating an account signup', () => {
          const accountName = 'myaccount';
          const req = {
            body: {
              name: accountName,
            },
          };
          const res = {
            status: () => {
            },
            json: () => {
            },
          };
          const next = () => {
          };
          it('should return 201 if successful', () => {
            const mock = sinon.mock(res);
            mock.expects('status').once().withArgs(201);
            createAccountSignup(req, res, next);
            mock.verify();
          });
          it('should set include message in response', () => {
            const mock = sinon.mock(res);
            mock.expects('json').once().withArgs({ message: `Account signup "${accountName}" created` });
            createAccountSignup(req, res, next);
            mock.verify();
          });
        });
      });
    });
  });
});
