import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as vb from '../../../../../src/readDomain/accountSignup/accountSignupStarted';

chai.use(dirtyChai);

describe('unit', () => {
  describe('readDomain', () => {
    describe('accountSignup', () => {
      describe('accountSignupStartedSpecs', () => {
        describe('when executed', () => {
          it('should set name and status of accountSignup from data in event', () => {
            const data = {
              name: 'myName',
              status: 'created',
            };
            const vm = {
              set: () => {
              },
            };
            const cb = () => {
            };
            const mockVm = sinon.mock(vm);
            mockVm.expects('set').withArgs('name', data.name);
            mockVm.expects('set').withArgs('status', data.status);
            vb.denormFn(data, mockVm.object, cb);
            mockVm.verify();
          });
        });
      });
    });
  });
});
