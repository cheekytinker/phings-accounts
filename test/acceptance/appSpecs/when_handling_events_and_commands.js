import { describe, it, before } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import app from '../../../src/app';
import mbusDomain from '../../../src/mbusDomain';

const expect = chai.expect;
chai.use(dirtyChai);

describe('acceptance', () => {
  describe('app', () => {
    describe.skip('when handling events and commands', () => {
      let theDone = null;
      const cb = (msg) => {
        theDone(msg);
      };
      before((done) => {
        app.start(cb)
          .then(() => {
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('should handle events raised on bus', (done) => {
        theDone = (msg) => {
          expect(msg.name).to.equal('testEvent');
          done();
        };
        mbusDomain.emitEvent({ name: 'testEvent' });
      }).timeout(20000);
      it('should handle commands raised on bus', (done) => {
        theDone = (msg) => {
          expect(msg.name).to.equal('testCommand');
          done();
        };
        mbusDomain.emitCommand({ name: 'testCommand' });
      }).timeout(20000);
    });
  });
});
