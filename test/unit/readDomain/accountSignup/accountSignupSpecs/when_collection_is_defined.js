import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import * as col from '../../../../../src/readDomain/accountSignup/accountSignup';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('readDomain', () => {
    describe('accountSignup', () => {
      describe('accountSignupSpecs', () => {
        describe('when collection is defined', () => {
          it('should be named accountSignup', () => {
            expect(col.name).to.equal('accountSignup');
          });
          it('should define payload as payload', () => {
            expect(col.defaultPayload).to.equal('payload');
          });
        });
      });
    });
  });
});
