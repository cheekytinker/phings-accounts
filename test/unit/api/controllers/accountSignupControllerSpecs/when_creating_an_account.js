import { describe, it, before, after } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as d from '../../../../../src/cqrsDomain';
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
          before(() => {
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
            const domain = d.domain;
            stubHandle = sinon.stub(domain, 'handle');
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
          });
          after(() => {
            stubHandle.restore();
          });
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
