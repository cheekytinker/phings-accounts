import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
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
          domain.handle({
            id: 'b80ade36-dd05-4340-8a8b-846eea6e286f',
            name: 'startAccountSignup',
            aggregate: {
              id: '3b4d44b0-34fb-4ceb-b212-68fe7a7c2f70',
              name: 'account',
            },
            payload: {
              name: 'MyNewAccount',
            },
            revision: 0,
            version: 1,
            meta: {
              userId: 'ccd65819-4da4-4df9-9f24-5b10bf89ef89',
            },
          }, (error, events, aggregateData) => {
            console.log(aggregateData);
            done(error);
          });
        });
      });
    });
  });
});
