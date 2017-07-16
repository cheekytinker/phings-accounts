import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import { domain, reset } from '../../../src/cqrsSagaDomain';

chai.use(dirtyChai);

describe('integration', () => {
  describe('cqrsSagaDomain', () => {
    describe('when initialised', () => {
      it('should start successfully', (done) => {
        reset();
        const dom = domain();
        dom.init((err, warnings) => {
          if (warnings) {
            console.log(`Warnings ${warnings}`);
            return;
          }
          if (err) {
            console.log(`Error ${err}`);
            return;
          }
          const info = dom.getInfo();
          console.log(info);
          done();
        });
      });
      it('should start if called twice', (done) => {
        reset();
        domain();
        const dom = domain();
        dom.init((err, warnings) => {
          if (warnings) {
            console.log(`Warnings ${warnings}`);
            return;
          }
          if (err) {
            console.log(`Error ${err}`);
            return;
          }
          const info = dom.getInfo();
          console.log(info);
          done();
        });
      });
    });
  });
});
