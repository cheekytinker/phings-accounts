import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as rd from '../../../../../src/cqrsReadDomain';
import { readAccountSignup } from '../../../../../src/api/controllers/accountSignupController';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('api', () => {
    describe('controllers', () => {
      describe('accountSignupControllerSpecs', () => {
        describe('when reading an account', () => {
          const accountName = 'myaccount';
          const req = {
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
          const spyReadDomain = sinon.stub(rd.default, 'readDomain');
          spyReadDomain.returns(mockReadDomain);
          const res = {
            status: () => {
            },
            json: () => {
            },
          };
          const next = () => {
          };
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
