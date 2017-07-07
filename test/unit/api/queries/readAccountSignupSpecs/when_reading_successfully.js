import { describe, it, before, after } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as cqrsReadDomain from '../../../../../src/cqrsReadDomain';
import * as ras from '../../../../../src/api/queries/readAccountSignup';
import errorCodes from '../../../../../src/utilities/errorCodes';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('api', () => {
    describe('queries', () => {
      describe('readAccountSignupRest', () => {
        describe('when reading successfully', () => {
          const repo = {
            findOne: (opt, cb) => {
              cb();
            },
          };
          const repoStub = sinon.stub(repo, 'findOne');
          const accountSignup = {
            attributes: {
              id: 'myAccount',
              name: 'myAccountName',
              status: 'created',
            },
          };
          const rd = {
            repository: {
              extend: () => repo,
            },
          };
          let stub = null;
          before(() => {
            stub = sinon.stub(cqrsReadDomain.default, 'readDomain');
            stub.returns(rd);
          });
          after(() => {
            stub.restore();
            repoStub.restore();
          });
          it('should return only expected fields', (done) => {
            repoStub.callsArgWith(1, null, accountSignup);
            ras.default({ key: 'myAccount' })
              .then((entity) => {
                expect(entity).to.deep.equal({
                  key: 'myAccount',
                  name: 'myAccountName',
                  status: 'created',
                });
                done();
              });
          });
          it('should error if no key is supplied', (done) => {
            ras.default({ key: '' })
              .catch((err) => {
                expect(err).to.deep.equal({
                  code: errorCodes.badRequest,
                  message: 'No key supplied',
                });
                done();
              });
          });
          it('should error if repository errors', (done) => {
            repoStub.callsArgWith(1, 'An error', null);
            ras.default({ key: 'Akey' })
              .catch((err) => {
                expect(err).to.deep.equal({
                  code: errorCodes.serverError,
                  message: 'An error',
                });
                done();
              });
          });
          it('should error if repository returns null object', (done) => {
            repoStub.callsArgWith(1, null, null);
            const key = 'AKey';
            ras.default({ key })
              .catch((err) => {
                expect(err).to.deep.equal({
                  code: errorCodes.notFound,
                  message: `Account signup not found for ${key}`,
                });
                done();
              });
          });
        });
      });
    });
  });
})
;
