import { describe, it, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import * as dn from '../../../src/denormalizerWrapper';
import readDomain from '../../../src/cqrsReadDomain';

describe('unit', () => {
  describe('cqrsReadDomain', () => {
    describe('when initialised', () => {
      let denormStub = null;
      let repositoryOnMock = null;
      let revisionGuardStoreOnMock = null;
      const sandbox = sinon.sandbox.create();
      const sd = {
        repository: {
          on: () => {
          },
        },
        revisionGuardStore: {
          on: () => {
          },
        },
      };
      beforeEach(() => {
        denormStub = sandbox.stub(dn.default, 'denormalizer');
        repositoryOnMock = sandbox.mock(sd.repository);
        revisionGuardStoreOnMock = sandbox.mock(sd.revisionGuardStore);
      });
      afterEach(() => {
        sandbox.restore();
      });
      it('should register handler for repository and revisionGuardStore connect and disconnnect', () => {
        repositoryOnMock.expects('on').withArgs('connect', sinon.match.any);
        repositoryOnMock.expects('on').withArgs('disconnect', sinon.match.any);
        revisionGuardStoreOnMock.expects('on').withArgs('connect', sinon.match.any);
        revisionGuardStoreOnMock.expects('on').withArgs('disconnect', sinon.match.any);
        denormStub.returns(sd);
        readDomain.reset();
        readDomain.readDomain();
        repositoryOnMock.verify();
        revisionGuardStoreOnMock.verify();
      });
    });
  });
});
