import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import shortid from 'shortid';
import mochaAsync from '../../../helpers/mochaAsync';
import { send, wasAccepted } from '../../../../src/externalServices/smtpMessaging';

const expect = chai.expect;
chai.use(dirtyChai);

describe('integration', () => {
  describe('externalServices', () => {
    describe('smtpMessaging', () => {
      describe('when checking if a message was delivered', () => {
        it('should find email accepted event', mochaAsync(async () => {
          const email = 'anthony.hollingsworth@elateral.com';
          const date = new Date();
          date.setMinutes(date.getMinutes() - 5);
          const queryParams = {
            begin: (date.getTime() / 1000).toString(),
            ascending: 'yes',
            limit: 25,
            pretty: 'yes',
            recipient: email,
          };
          const subject = shortid.generate();
          const retries = 10;
          try {
            await send(
              'me@samples.mailgun.org',
              email,
              subject,
              'test',
              'test',
            );
          } catch (err) {
            throw Error(err);
          }
          try {
            const event = await wasAccepted(queryParams, subject, retries);
            expect(event.message.headers.subject).to.equal(subject);
          } catch (err) {
            throw (err);
          }
        })).timeout(120000);
      });
    });
  });
});
