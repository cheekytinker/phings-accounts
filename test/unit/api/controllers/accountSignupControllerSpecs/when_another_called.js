import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import { another } from '../../../../../src/api/controllers/accountSignupController';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('api', () => {
    describe('controllers', () => {
      describe('accountSignupControllerSpecs', () => {
        describe('when another called', () => {
          const req = {};
          const res = {
            json: () => {},
          };
          const next = sinon.spy();
          it('should call next when complete', () => {
            another(req, res, next);
            expect(next.calledOnce);
          });
        });
      });
    });
  });
});
