import mailgun from 'mailgun-js';
import promiseRetry from 'promise-retry';
import config from '../config/application';
import { log } from '../utilities/logging';


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

function query(queryParams) {
  return new Promise((resolve, reject) => {
    server.events().get(queryParams, (err, body) => {
      if (err) {
        reject(err);
      }
      log.info('Got response from query');
      resolve(body);
    });
  });
}

function eventExists(queryParams, subject, event, retries) {
  const options = {
    retries: retries || 4,
  };
  return promiseRetry(options, (retry, number) => {
    log.info(`Attempt number ${number}`);
    return new Promise((resolve, reject) => {
      query(queryParams)
        .then((body) => {
          const found =
            body.items.filter(
              item => item.message.headers.subject === subject &&
              item.event === event);
          if (found.length === 1) {
            resolve(true);
          } else {
            reject();
          }
        });
    }).catch(retry);
  });
}

function wasDelivered(queryParams, subject, retries) {
  return eventExists(queryParams, subject, 'delivered', retries);
}

function wasAccepted(queryParams, subject, retries) {
  return eventExists(queryParams, subject, 'accepted', retries);
}

module.exports = {
  send,
  query,
  wasDelivered,
  wasAccepted,
};
