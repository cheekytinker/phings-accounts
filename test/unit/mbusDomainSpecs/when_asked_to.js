import { describe, it, before, beforeEach, after, afterEach } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import servicebus from '../../../src/servicebusWrapper';
import * as d from '../../../src/mbusDomain';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('mbusDomainSpecs', () => {
    describe('when asked to', () => {
      let stubBus = null;
      stubBus = sinon.stub(servicebus, 'bus');
      before(() => {
      });
      beforeEach(() => {
      });
      afterEach(() => {
      });
      after(() => {
        stubBus.restore();
      });
      it('emit a command should call publish on bus with a command', () => {
        let messageName = null;
        let payload = null;
        const bus = {
          publish: (theMessageName, thePayload) => {
            messageName = theMessageName;
            payload = thePayload;
          },
          subscribe: () => {
          },
        };
        stubBus.returns(bus);
        const command = {
          name: 'mycommand',
          payload: {
            someProp: 'fred',
          },
        };
        d.default.emitCommand(command);
        expect(messageName).to.equal('command');
        expect(payload).to.equal(JSON.stringify(command));
      });
      it('emit an event should call publish on bus with a event', () => {
        let messageName = null;
        let payload = null;
        const bus = {
          publish: (theMessageName, thePayload) => {
            messageName = theMessageName;
            payload = thePayload;
          },
          subscribe: () => {
          },
        };
        stubBus.returns(bus);
        const event = {
          name: 'myevent',
          payload: {
            someProp: 'fredevent',
          },
        };
        d.default.emitEvent(event);
        expect(messageName).to.equal('event');
        expect(payload).to.equal(JSON.stringify(event));
      });
      it('emit a notification should call publish on bus with a notification', () => {
        let messageName = null;
        let payload = null;
        const bus = {
          publish: (theMessageName, thePayload) => {
            messageName = theMessageName;
            payload = thePayload;
          },
          subscribe: () => {
          },
        };
        stubBus.returns(bus);
        const notification = {
          name: 'myNotification',
          payload: {
            someProp: 'fredevent',
          },
        };
        d.default.emitNotification(notification);
        expect(messageName).to.equal('notification');
        expect(payload).to.equal(JSON.stringify(notification));
      });
      it('subscribe to a command should subscribe to bus for a command for first subscription', () => {
        let callback = null;
        let subscribeTo = null;
        const bus = {
          publish: () => {
          },
          subscribe: (theSubscribeTo, theCallback) => {
            callback = theCallback;
            subscribeTo = theSubscribeTo;
          },
        };
        stubBus.returns(bus);
        const cb = () => {};
        d.default.onCommand(cb);
        expect(subscribeTo).to.equal('command');
        expect(typeof (callback)).is.equal('function');
      });
      it('subscribe to an event should subscribe to bus for an event for first subscription', () => {
        let callback = null;
        let subscribeTo = null;
        const bus = {
          publish: () => {
          },
          subscribe: (theSubscribeTo, theCallback) => {
            callback = theCallback;
            subscribeTo = theSubscribeTo;
          },
        };
        stubBus.returns(bus);
        const cb = () => {};
        d.default.onEvent(cb);
        expect(subscribeTo).to.equal('event');
        expect(typeof (callback)).is.equal('function');
      });
    });
  });
});
