import { describe, it } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import shortid from 'shortid';
import mochaAsync from '../../../helpers/mochaAsync';
import { send, getMessageDetails, wasAccepted } from '../../../../src/externalServices/smtpMessaging';

const expect = chai.expect;
chai.use(dirtyChai);

describe.skip('integration', () => {
  describe('externalServices', () => {
    describe('smtpMessaging', () => {
      describe('when retrieving a message body', () => {
        it('find vc', () => {
          function findVerificationCode(messageDetails) {
            const verificationCode = messageDetails['body-html'].match(/.*verification\/(.*)/i);
            if (!verificationCode || verificationCode.length < 2) {
              return null;
            }
            return verificationCode[1];
          }
          expect(findVerificationCode(
            {
              'body-html': 'http://localhost:10010/accountSignups/SkPstlIUW/verification/BkDjYxUUb',
            })).to.equal('BkDjYxUUb');
        });

        it('should get the body', mochaAsync(async () => {
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
          const htmlBody = `<div>test${shortid.generate()}</div>`;
          const textBody = `test${shortid.generate()}`;
          const retries = 10;
          await send(
            'me@samples.mailgun.org',
            email,
            subject,
            textBody,
            htmlBody,
          );
          const event = await wasAccepted(queryParams, subject, retries);
          const messageDetails = await getMessageDetails(event);
          expect(messageDetails['body-html']).to.equal(htmlBody);
        })).timeout(120000);
      });
    });
  });
});
