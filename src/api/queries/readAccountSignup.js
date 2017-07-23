import { log } from './../../utilities/logging';
import errorCodes from '../../utilities/errorCodes';
import * as cqrsReadDomain from '../../cqrsReadDomain';

export default function readAccountSignup({ key: keyToFind }) {
  const accountSignupRepo = cqrsReadDomain.default.readDomain().repository.extend({
    collectionName: 'accountSignup',
  });
  log.info('readAccountSignup');
  return new Promise((resolve, reject) => {
    if (!keyToFind) {
      log.info('No key supplied');
      reject({
        code: errorCodes.badRequest,
        message: 'No key supplied',
      });
      return;
    }
    log.info(`find one ${keyToFind}`);
    accountSignupRepo.findOne({ name: keyToFind }, (err, accountSignup) => {
      log.info('got readAccountSignup');
      if (err) {
        log.error(err);
        reject({
          code: errorCodes.serverError,
          message: err,
        });
        return;
      }
      if (accountSignup === null) {
        log.info(`Account signup not found for ${keyToFind}`);
        reject({
          code: errorCodes.notFound,
          message: `Account signup not found for ${keyToFind}`,
        });
        return;
      }
      log.info('success readAccountSignup');
      const { name: key, name, status } = accountSignup.attributes;
      resolve({
        key,
        name,
        status,
        id: accountSignup.id,
      });
    });
  });
}

