import mailgun from 'mailgun-js';
import config from '../config/application';

const server = mailgun({
  apiKey: config.mailgun.apiKey,
  domain: config.mailgun.domain,
});

function send(from, to, subject, text, html) {
  const data = {
    from,
    to,
    subject,
    text,
    html,
  };
  return new Promise((resolve, reject) => {
    server.messages().send(data, (error, body) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(body);
    });
  });
}

module.exports = {
  send,
};
