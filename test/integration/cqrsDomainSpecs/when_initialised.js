import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import '../../../src/utilities/initialiseExternalServices';
import { domain } from '../../../src/cqrsDomain';

chai.use(dirtyChai);

describe('integration', () => {
  describe('cqrsDomainSpecs', () => {
    describe('when initialised', () => {
      it('should start successfully', (done) => {
        domain.init((err, warnings) => {
          if (warnings) {
            console.log(`Warnings ${warnings}`);
            return;
          }
          if (err) {
            console.log(`Error ${err}`);
            return;
          }
          const info = domain.getInfo();
          console.log(info);
          done();
        });
      });
    });
  });
});
