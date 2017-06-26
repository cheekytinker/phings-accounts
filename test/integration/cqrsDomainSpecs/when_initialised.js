import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import '../../../src/utilities/initialiseExternalServices';
import { domain, reset } from '../../../src/cqrsDomain';

chai.use(dirtyChai);

describe('integration', () => {
  describe('cqrsDomain', () => {
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
    });
  });
});
