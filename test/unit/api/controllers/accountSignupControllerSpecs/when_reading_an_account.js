import { describe, it, before, after } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as ras from '../../../../../src/api/queries/readAccountSignup';
import errorCodes from '../../../../../src/utilities/errorCodes';
import { readAccountSignupRest } from '../../../../../src/api/controllers/accountSignupController';

chai.use(dirtyChai);

describe('unit', () => {
  describe('api', () => {
    describe('controllers', () => {
      describe('accountSignupControllerSpecs', () => {
        describe('when reading an accountSignup', () => {
          let req = null;
          let res = null;
          let next = null;
          const readAccountSignupStub = sinon.stub(ras, 'default');
          let accountName = null;
          before(() => {
            accountName = 'myaccount';
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
                },
              },
            };
          });
          after(() => {
            if (readAccountSignupStub) {
              readAccountSignupStub.restore();
            }
          });
          it('should return 200 if successful', (done) => {
            readAccountSignupStub.returns(Promise.resolve({
              key: accountName,
              name: accountName,
              status: 'created',
            }));
            const mock = sinon.mock(res);
            mock.expects('status').once().withArgs(200);
            readAccountSignupRest(req, res, next)
              .then(() => {
                mock.verify();
                done();
              })
              .catch((err) => {
                done(err);
              });
          });
          it('should return accountSignup if successful', (done) => {
            readAccountSignupStub.returns(Promise.resolve({
              key: accountName,
              name: accountName,
              status: 'created',
            }));
            const mock = sinon.mock(res);
            mock.expects('json').once().withArgs({
              key: accountName,
              name: accountName,
              status: 'created',
            });
            readAccountSignupRest(req, res, next)
              .then(() => {
                mock.verify();
                done();
              })
              .catch((err) => {
                done(err);
              });
          });
          it('should return 500 if repo returns err', (done) => {
            readAccountSignupStub.returns(Promise.reject({
              code: errorCodes.serverError,
              message: 'Some server error',
            }));
            const mock = sinon.mock(res);
            mock.expects('status').once().withArgs(500);
            readAccountSignupRest(req, res, next)
              .then(() => {
                mock.verify();
                done();
              })
              .catch((err) => {
                done(err);
              });
          });
          it('should return 404 if repo cannot find signup', (done) => {
            readAccountSignupStub.returns(Promise.reject({
              code: errorCodes.notFound,
              message: 'Cannot find it',
            }));
            const mock = sinon.mock(res);
            mock.expects('status').once().withArgs(404);
            readAccountSignupRest(req, res, next)
              .then(() => {
                mock.verify();
                done();
              })
              .catch((err) => {
                done(err);
              });
          });
          it('should return 400 if key not supplied', (done) => {
            readAccountSignupStub.returns(Promise.reject({
              code: errorCodes.badRequest,
              message: 'No key supplied',
            }));
            const mock = sinon.mock(res);
            mock.expects('status').once().withArgs(400);
            readAccountSignupRest(req, res, next)
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
