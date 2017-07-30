import { describe, it, after } from 'mocha';
import sinon from 'sinon';
import * as sb from 'servicebus';
import servicebus from '../../../src/servicebusWrapper';

describe('unit', () => {
  describe('serviceBusWrapper', () => {
    describe('when asking for the bus multiple times', () => {
      let sandbox = null;
      after(() => {
        if (sandbox) {
          sandbox.restore();
        }
      });
      it('only connect to bus on the first call', () => {
        servicebus.reset();
        sandbox = sinon.sandbox.create();
        const sbMock = sandbox.mock(sb.default);
        sbMock.expects('bus').withArgs(sinon.match.any).once().returns({
          logger: () => {},
          correlate: () => {},
          use: () => {},
        });
        servicebus.bus();
        servicebus.bus();
        sbMock.verify();
      });
    });
  });
});
