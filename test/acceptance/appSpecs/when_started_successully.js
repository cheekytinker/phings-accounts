import { describe, it } from 'mocha';
import app from '../../../src/app';

describe('acceptance', () => {
  describe('app', () => {
    it('should start without errors', (done) => {
      app.start()
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    }).timeout(10000);
  });
});
