import { describe, it, beforeEach } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import supertest from 'supertest-as-promised';
import app from '../../../../src/app';
import mochaAsync from '../../../helpers/mochaAsync';

const expect = chai.expect;
chai.use(dirtyChai);

describe('acceptance', () => {
  describe('api', () => {
    describe('accountSignupSpecs', () => {
      describe('when signing up for an account', () => {
        beforeEach(mochaAsync(async () => {
          await app.restart();
        }));
        it('should require primary contact', mochaAsync(async () =>
          supertest(app.server())
            .post('/accountSignups/')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', 'application/json')
            .expect(400)
            .then((res) => {
              const { body: { errors: [{ errors: [{ params: [param] }] }] } } = res;
              expect(param).to.deep.equal('primaryContact');
            }),
        )).timeout(10000);
      });
    });
  });
});
