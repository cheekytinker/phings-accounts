import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import * as vb from '../../../../../src/readDomain/accountSignup/accountCreated';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('readDomain', () => {
    describe('accountSignup', () => {
      describe('accountCreated', () => {
        describe('when viewbuilder defined', () => {
          it('should have a name that matches the event it applies to', () => {
            expect(vb.name).to.equal('accountCreated');
          });
          it('should have an aggregate of account', () => {
            expect(vb.aggregate).to.equal('account');
          });
          it('should have id of aggregate.id', () => {
            expect(vb.id).to.equal('aggregate.id');
          });
          it('should have autoCreate to ensure new view model created if with id exists', () => {
            expect(vb.autoCreate).to.equal(true);
          });
          it('should have payload set to payload', () => {
            expect(vb.payload).to.equal('payload');
          });
        });
      });
    });
  });
});