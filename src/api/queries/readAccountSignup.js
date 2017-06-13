import { log } from './../../utilities/logging';
import { readDomain } from '../../cqrsReadDomain';

function readAccountSignup({ key: keyToFind }) {
  const accountSignupRepo = readDomain.repository.extend({
    collectionName: 'accountSignup',
  });
  log.info('readAccountSignup');
  return new Promise((resolve, reject) => {
    if (!keyToFind) {
      return reject('No key supplied');
    }
    return accountSignupRepo.findOne({ id: keyToFind }, (err, accountSignup) => {
      log.info('got readAccountSignup');
      if (err) {
        log.error(err);
        reject(err);
        return;
      }
      if (accountSignup === null) {
        log.info(`Account signup not found ${keyToFind}`);
        reject(`Account signup not found ${keyToFind}`);
        return;
      }
      log.info('success readAccountSignup');
      const { id: key, name, status } = accountSignup.attributes;
      resolve({
        key,
        name,
        status,
      });
    });
  });
}

export {
  readAccountSignup,
};

