import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import supertest from 'supertest';

const expect = chai.expect;
chai.use(dirtyChai)

describe('acceptance', () => {
  describe('api', () => {
    describe('accountSignupSpecs', () => {
      describe('when signing up for an account', () => {
        it('should require email address', () => {
          supertest
        });
        it('should send an email to the supplied email address');
      });
    });
  });
});
