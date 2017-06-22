import { describe, it, beforeEach, afterEach } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import * as rule from '../../../../../src/domain/account/accountAlreadyExists';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('domain', () => {
    describe('accountSignup', () => {
      describe('when accountSignup already exists rule is run', () => {
        const changed = {};
        const events = {};
        const previous = {
          get: () => {},
        };
        const command = {
          name: 'startAccountSignup',
        };
        let stubGet = null;
        beforeEach(() => {
          stubGet = sinon.stub(previous, 'get');
          stubGet.withArgs('status').returns(undefined);
        });
        afterEach(() => {
          stubGet.restore();
          command.name = 'startAccountSignup';
        });
        it('should be named accountAlreadyExists', () => {
          expect(rule.name).is.equal('accountAlreadyExists');
        });
        it('should not raise an error if status is undefined', () => {
          expect(rule.businessRuleFn.bind(
            rule,
            changed,
            previous,
            events,
            command)).not.to.throw();
        });
        it('should not raise an error if a different command', () => {
          stubGet.withArgs('status').returns('created');
          command.name = 'anotherCommand';
          expect(rule.businessRuleFn.bind(
            rule,
            changed,
            previous,
            events,
            command)).not.to.throw();
        });
        it('should raise error if command is startAccountSignup and accountSignup already exists', () => {
          stubGet.restore();
          stubGet = sinon.stub(previous, 'get');
          stubGet.withArgs('status').returns('created');
          expect(rule.businessRuleFn.bind(
            rule,
            changed,
            previous,
            events,
            command)).to.throw();
        });
      });
    });
  });
});
