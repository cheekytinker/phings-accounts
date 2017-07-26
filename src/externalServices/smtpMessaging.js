import mailgun from 'mailgun-js';
import promiseRetry from 'promise-retry';
import superagent from 'superagent';
import agentp from 'superagent-promise';
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

function get(queryParams) {
  return new Promise((resolve, reject) => {
    server.get(queryParams, (err, body) => {
      if (err) {
        reject(err);
      }
      log.info('Got response from query');
      resolve(body);
    });
  });
}

function getFirstPage(queryParams, reject, subject, event, resolve) {
  let next = null;
  query(queryParams)
    .then((body) => {
      const lastTimeStamp =
        body.items.length > 0 ? body.items[body.items.length - 1].timestamp : null;
      const nextPageUrl = body.paging.next;
      if (lastTimeStamp && lastTimeStamp < queryParams.begin) {
        next = nextPageUrl;
        reject();
      } else {
        const found =
          body.items.filter(
            item => item.message.headers.subject === subject &&
              item.event === event);
        if (found.length === 1) {
          resolve(found[0]);
        } else {
          reject();
        }
      }
    });
  return next;
}

function getNextPage(queryParams, nextUrl, subject, event, reject, resolve) {
  let next = null;
  get(nextUrl)
    .then((body) => {
      const lastTimeStamp =
        body.items.length > 0 ? body.items[body.items.length - 1].timestamp : null;
      const nextPageUrl = body.paging.next;
      if (lastTimeStamp && lastTimeStamp < queryParams.begin) {
        next = nextPageUrl;
        reject();
      } else {
        const found =
          body.items.filter(
            item => item.message.headers.subject === subject &&
              item.event === event);
        if (found.length === 1) {
          resolve(found[0]);
        } else {
          reject();
        }
      }
    });
  return next;
}

function eventExists(queryParams, subject, event, retries) {
  const options = {
    retries: retries || 4,
  };
  let next = null;
  return promiseRetry(options, (retry, number) => {
    log.info(`Attempt number ${number}`);
    return new Promise((resolve, reject) => {
      if (next) {
        next = getNextPage(queryParams, next, subject, event, reject, resolve);
      } else {
        next = getFirstPage(queryParams, reject, subject, event, resolve);
      }
    }).catch(retry);
  });
}

function wasDelivered(queryParams, subject, retries) {
  return eventExists(queryParams, subject, 'delivered', retries);
}

function wasAccepted(queryParams, subject, retries) {
  return eventExists(queryParams, subject, 'accepted', retries);
}

function getMessageDetails(message) {
  return new Promise((resolve, reject) => {
    if (!message) {
      reject('Message must be supplied');
    }
    const url = message.storage.url;
    const agent = agentp(superagent, Promise);
    const authToken = new Buffer(`api:${config.mailgun.apiKey}`).toString('base64');
    return agent('GET', url)
      .set('Authorization', `Basic ${authToken}`)
      .end()
      .then(res => resolve(res.body));
  });
}

module.exports = {
  send,
  query,
  wasDelivered,
  wasAccepted,
  getMessageDetails,
};
