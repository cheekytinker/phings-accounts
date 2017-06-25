import { describe, beforeEach, afterEach, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import servicebus from '../../../src/servicebusWrapper';
import * as d from '../../../src/mbusDomain';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('mbusDomain', () => {
    describe('when clearing subscriptions', () => {
      const sandbox = sinon.sandbox.create();
      let stubBus = null;
      beforeEach(() => {
        stubBus = sandbox.stub(servicebus, 'bus');
      });
      afterEach(() => {
        sandbox.restore();
        d.default.clearSubscriptions();
      });
      it('not call previously subscribed functions when command raised', () => {
        let callback = null;
        const bus = {
          publish: () => {
          },
          subscribe: (theSubscribeTo, theCallback) => {
            callback = theCallback;
          },
        };
        stubBus.returns(bus);
        let setBySubscribedCallback = false;
        const cb = () => {
          setBySubscribedCallback = true;
        };
        d.default.onCommand(cb);
        d.default.clearSubscriptions();
        callback(JSON.stringify({}));
        expect(setBySubscribedCallback).to.equal(false);
      });
      it('not call previously subscribed functions when event raised', () => {
        let callback = null;
        const bus = {
          publish: () => {
          },
          subscribe: (theSubscribeTo, theCallback) => {
            callback = theCallback;
          },
        };
        stubBus.returns(bus);
        let setBySubscribedCallback = false;
        const cb = () => {
          setBySubscribedCallback = true;
        };
        d.default.onEvent(cb);
        d.default.clearSubscriptions();
        callback(JSON.stringify({}));
        expect(setBySubscribedCallback).to.equal(false);
      });
    });
  });
});
