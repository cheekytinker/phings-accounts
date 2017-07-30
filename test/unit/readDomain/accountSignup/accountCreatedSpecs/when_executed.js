import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as vb from '../../../../../src/readDomain/accountSignup/accountCreated';

chai.use(dirtyChai);

describe('unit', () => {
  describe('readDomain', () => {
    describe('accountSignup', () => {
      describe('accountCreated', () => {
        describe('when executed', () => {
          it('should set name, primaryContact and status of accountSignup from data in event', () => {
            const data = {
              name: 'myName',
              status: 'created',
              primaryContact: {
                firstName: 'a',
                lastName: 'b',
                email: 'a@b.com',
                userName: 'a',
                password: 'pass123',
              },
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
            mockVm.expects('set').withArgs('primaryContact', data.primaryContact);
            vb.denormFn(data, mockVm.object, cb);
            mockVm.verify();
          });
        });
      });
    });
  });
});
