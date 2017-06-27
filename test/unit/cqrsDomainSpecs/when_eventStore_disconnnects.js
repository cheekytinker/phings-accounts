import { describe, it, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import * as dom from '../../../src/domainWrapper';
import * as cqrsDom from '../../../src/cqrsDomain';

describe('unit', () => {
  describe('cqrsDomain', () => {
    describe('when eventStore disconnects', () => {
      let denormStub = null;
      let eventStoreStub = null;
      let aggregateLockOnStub = null;
      const sandbox = sinon.sandbox.create();
      const sd = {
        on: (event, cb) => { cb(); },
        eventStore: {
          on: () => {
          },
        },
        aggregateLock: {
          on: () => {
          },
        },
      };
      beforeEach(() => {
        denormStub = sandbox.stub(dom.default, 'domain');
        eventStoreStub = sandbox.stub(sd.eventStore, 'on');
        aggregateLockOnStub = sandbox.stub(sd.aggregateLock, 'on');
      });
      afterEach(() => {
        sandbox.restore();
      });
      it('should log for repository and revisionGuardStore connect and disconnnect', () => {
        eventStoreStub.withArgs('connect', sinon.match.any).callsArgWith(1);
        eventStoreStub.withArgs('disconnect', sinon.match.any).callsArgWith(1);
        aggregateLockOnStub.withArgs('connect', sinon.match.any).callsArgWith(1);
        aggregateLockOnStub.withArgs('disconnect', sinon.match.any).callsArgWith(1);
        denormStub.returns(sd);
        cqrsDom.default.reset();
        cqrsDom.default.domain();
      });
    });
  });
});
