import { describe, it, before, after } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as rd from '../../../../../src/cqrsReadDomain';
import { readAccountSignup } from '../../../../../src/api/controllers/accountSignupController';

chai.use(dirtyChai);

function stubfindOne(stubReadDomain, res, next, findOneResponse) {
  const ret = {
    stubReadDomain,
    res,
    next,
  };
  const mockReadDomain = {
    repository: {
      extend: () => ({
        findOne: findOneResponse,
      }),
    },
  };
  if (ret.stubReadDomain) {
    ret.stubReadDomain.restore();
  }
  ret.stubReadDomain = sinon.stub(rd.default, 'readDomain');
  ret.stubReadDomain.returns(mockReadDomain);
  ret.res = {
    status: () => {
    },
    json: () => {
    },
  };
  ret.next = () => {
  };
  return ret;
}

describe('unit', () => {
  describe('api', () => {
    describe('controllers', () => {
      describe('accountSignupControllerSpecs', () => {
        describe('when reading an accountSignup', () => {
          let req = null;
          let res = null;
          let next = null;
          let stubReadDomain = null;
          let accountName = null;
          before(() => {
            accountName = 'myaccount';
            req = {
              swagger: {
                params: {
                  key: {
                    value: accountName,
                  },
                },
              },
            };
          });
          after(() => {
            if (stubReadDomain) {
              stubReadDomain.restore();
            }
          });
          it('should return 200 if successful', (done) => {
            ({ res, next, stubReadDomain } =
              stubfindOne(
                stubReadDomain,
                res,
                next,
                (params, cb) => {
                  cb(null, {
                    attributes: {
                      name: accountName,
                      id: accountName,
                      status: 'created',
                    },
                  });
                },
              ));
            const mock = sinon.mock(res);
            mock.expects('status').once().withArgs(200);
            readAccountSignup(req, res, next);
            mock.verify();
            done();
          });
          it('should return 500 if repo returns err', (done) => {
            ({ res, next, stubReadDomain } =
              stubfindOne(
                stubReadDomain,
                res,
                next,
                (params, cb) => {
                  cb('An error', null);
                },
              ));
            const mock = sinon.mock(res);
            mock.expects('status').once().withArgs(500);
            readAccountSignup(req, res, next);
            mock.verify();
            done();
          });
        });
      });
    });
  });
});
