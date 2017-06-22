import { describe, it, before, after } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as rd from '../../../../../src/cqrsReadDomain';
import { readAccountSignup } from '../../../../../src/api/controllers/accountSignupController';

chai.use(dirtyChai);

describe('unit', () => {
  describe('api', () => {
    describe('controllers', () => {
      describe('accountSignupControllerSpecs', () => {
        describe('when reading an accountSignup', () => {
          let req = null;
          let res = null;
          let next = null;
          let stubReadDomain = null;
          before(() => {
            const accountName = 'myaccount';
            req = {
              swagger: {
                params: {
                  key: {
                    value: accountName,
                  },
                },
              },
            };
            const mockReadDomain = {
              repository: {
                extend: () => ({
                  findOne: (params, cb) => {
                    cb(null, {
                      attributes: {
                        name: accountName,
                        id: accountName,
                        status: 'created',
                      },
                    });
                  },
                }),
              },
            };
            stubReadDomain = sinon.stub(rd.default, 'readDomain');
            stubReadDomain.returns(mockReadDomain);
            res = {
              status: () => {
              },
              json: () => {
              },
            };
            next = () => {
            };
          });
          after(() => {
            if (stubReadDomain) {
              stubReadDomain.restore();
            }
          });
          it('should return 200 if successful', (done) => {
            const mock = sinon.mock(res);
            mock.expects('status').once().withArgs(200);
            readAccountSignup(req, res, next);
            mock.verify();
            done();
          });
        });
      });
    });
  });
});
