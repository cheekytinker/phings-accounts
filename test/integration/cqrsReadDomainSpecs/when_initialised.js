import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import viewmodel from 'viewmodel';
import config from '../../../src/config/denormalizer';
import cqrsReadDomain from '../../../src/cqrsReadDomain';

chai.use(dirtyChai);

describe('integration', () => {
  describe('cqrsReadDomain', () => {
    describe('when initialised', () => {
      it('should succeed', (done) => {
        cqrsReadDomain.reset();
        viewmodel.read(config.repository, (err) => {
          if (err) {
            done(err);
          }
          cqrsReadDomain.readDomain().init((err2, warnings2) => {
            if (warnings2) {
              done(err2);
              return;
            }
            if (err2) {
              done(err2);
              return;
            }
            done();
          });
        });
      });
    });
  });
});
