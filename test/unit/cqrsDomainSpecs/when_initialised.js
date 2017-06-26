import { describe, it, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import * as dom from '../../../src/domainWrapper';
import * as cqrsDom from '../../../src/cqrsDomain';

describe('unit', () => {
  describe('cqrsDomain', () => {
    describe('when initialised', () => {
      let domainStub = null;
      let eventStoreMock = null;
      let aggregateLockMock = null;
      const sandbox = sinon.sandbox.create();
      const onSpy = sandbox.spy();
      const sd = {
        on: onSpy,
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
        domainStub = sandbox.stub(dom.default, 'domain');
        eventStoreMock = sandbox.mock(sd.eventStore);
        aggregateLockMock = sandbox.mock(sd.aggregateLock);
      });
      afterEach(() => {
        sandbox.restore();
      });
      it('should subscribe to eventStore connect event', () => {
        domainStub.returns(sd);
        cqrsDom.default.reset();
        cqrsDom.default.domain();
        eventStoreMock.expects('on').withArgs('connect', sinon.match.any);
        eventStoreMock.expects('on').withArgs('disconnect', sinon.match.any);
        aggregateLockMock.expects('on').withArgs('disconnect', sinon.match.any);
        aggregateLockMock.expects('on').withArgs('disconnect', sinon.match.any);
        sandbox.assert.calledWith(onSpy, 'connect', sinon.match.any);
        sandbox.assert.calledWith(onSpy, 'disconnect', sinon.match.any);
      });
    });
  });
});
