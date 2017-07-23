import uuidv4 from 'uuid';
import { log } from './../../utilities/logging';
import { domain } from '../../cqrsDomain';
import readAccountSignup from './../queries/readAccountSignup';

async function getAccountSignupId(key) {
  const accountSignup = await readAccountSignup(key);
  return accountSignup.id;
}

async function verifyAccountSignup({ input }) {
  log.info('verifyAccountSignup');
  let accountId = null;
  try {
    accountId = await getAccountSignupId({ key: input.key });
  } catch (err) {
    return Promise.reject(err);
  }
  return new Promise((resolve, reject) => {
    domain().handle({
      id: uuidv4(),
      name: 'submitAccountEmailVerificationCode',
      aggregate: {
        id: accountId,
        name: 'account',
      },
      payload: input,
      revision: 0,
      version: 1,
      meta: {
        userId: 'ccd65819-4da4-4df9-9f24-5b10bf89ef89',
      },
    }, (err, events, aggregateData) => {
      if (err) {
        log.error(`Error: ${err.name} : ${err.message} : ${err.more}`);
        reject(err);
        return;
      }
      log.info(JSON.stringify(aggregateData));
      const { id, name, status } = aggregateData;
      resolve({ id, name, status });
    });
  });
}

export default verifyAccountSignup;

