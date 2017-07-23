import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import shortid from 'shortid';
import { send, wasDelivered, wasAccepted } from '../../../../src/externalServices/smtpMessaging';

const expect = chai.expect;
chai.use(dirtyChai);

describe('integration', () => {
  describe('externalServices', () => {
    describe('smtpMessaging', () => {
      describe('when checking if a message was delivered', () => {
        it('should find email accepted event', (done) => {
          const email = 'anthony.hollingsworth@elateral.com';
          const date = new Date();
          date.setMinutes(date.getMinutes() - 5);
          const queryParams = {
            begin: (date.getTime() / 1000).toString(),
            ascending: 'no',
            limit: 25,
            pretty: 'no',
            recipient: email,
          };
          const subject = shortid.generate();
          const retries = 10;
          send(
              'me@samples.mailgun.org',
              email,
              subject,
              'test',
              'test',
          )
          .then(() => wasAccepted(queryParams, subject, retries))
          .then((result) => {
            expect(result).to.equal(true);
          })
          .catch((err) => {
            done(err);
          });
        }).timeout(120000);
      });
    });
  });
});
