import { describe, it, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import * as dn from '../../../src/denormalizerWrapper';
import readDomain from '../../../src/cqrsReadDomain';

describe('unit', () => {
  describe('cqrsReadDomain', () => {
    describe('when repository disconnects', () => {
      let denormStub = null;
      let repositoryOnStub = null;
      let revisionGuardStoreOnStub = null;
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
        repositoryOnStub = sandbox.stub(sd.repository, 'on');
        revisionGuardStoreOnStub = sandbox.stub(sd.revisionGuardStore, 'on');
      });
      afterEach(() => {
        sandbox.restore();
      });
      it('should log for repository and revisionGuardStore connect and disconnnect', () => {
        repositoryOnStub.withArgs('connect', sinon.match.any).callsArgWith(1);
        repositoryOnStub.withArgs('disconnect', sinon.match.any).callsArgWith(1);
        revisionGuardStoreOnStub.withArgs('connect', sinon.match.any).callsArgWith(1);
        revisionGuardStoreOnStub.withArgs('disconnect', sinon.match.any).callsArgWith(1);
        denormStub.returns(sd);
        readDomain.reset();
        readDomain.readDomain();
      });
    });
  });
});
