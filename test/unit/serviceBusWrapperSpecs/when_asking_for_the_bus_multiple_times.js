import { describe, it } from 'mocha';
import sinon from 'sinon';
import * as sb from 'servicebus';
import servicebus from '../../../src/servicebusWrapper';

describe('unit', () => {
  describe('serviceBusWrapper', () => {
    describe('when asking for the bus multiple times', () => {
      it('only connect to bus on the first call', () => {
        servicebus.reset();
        const sandbox = sinon.sandbox.create();
        const sbMock = sandbox.mock(sb.default);
        sbMock.expects('bus').withArgs(sinon.match.any).once().returns({});
        servicebus.bus();
        servicebus.bus();
        sbMock.verify();
      });
    });
  });
});
