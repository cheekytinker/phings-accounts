import { describe, it, beforeEach, afterEach } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import servicebus from '../../../src/servicebusWrapper';
import * as d from '../../../src/mbusDomain';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('mbusDomain', () => {
    describe('when a command is sent by the bus', () => {
      const sandbox = sinon.sandbox.create();
      let stubBus = null;
      beforeEach(() => {
        d.default.clearSubscriptions();
        stubBus = sandbox.stub(servicebus, 'bus');
      });
      afterEach(() => {
        sandbox.restore();
      });
      it('should call the subscribed handler functions', () => {
        let callback = null;
        const bus = {
          publish: () => {
          },
          subscribe: (theSubscribeTo, theCallback) => {
            callback = theCallback;
          },
        };
        stubBus.returns(bus);
        let passedMessage = null;
        const cb = (message) => {
          passedMessage = message;
        };
        d.default.onCommand(cb);
        const message = JSON.stringify({
          name: 'messageName',
          payload: 'my payload',
        });
        callback(message);
        expect(JSON.stringify(passedMessage)).is.equal(message);
      });
    });
  });
});
