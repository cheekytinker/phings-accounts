import { describe, it, before, after } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as cqrsReadDomain from '../../../../../src/cqrsReadDomain';
import * as ras from '../../../../../src/api/queries/readAccountSignup';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('api', () => {
    describe('queries', () => {
      describe('readAccountSignup', () => {
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
          repoStub.callsArgWith(1, null, accountSignup);
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
          });
          it('should return only expected fields', (done) => {
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
        });
      });
    });
  });
})
;
