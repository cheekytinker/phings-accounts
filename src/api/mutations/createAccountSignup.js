import uuidv4 from 'uuid';
import { log } from './../../utilities/logging';
import { domain } from '../../cqrsDomain';

export default function createAccountSignup({ input: { name: accountName } }) {
  log.info('createAccountSignup');
  return new Promise((resolve, reject) => {
    domain.handle({
      id: uuidv4(),
      name: 'startAccountSignup',
      aggregate: {
        id: `${accountName}`,
        name: 'accountSignup',
      },
      payload: {
        name: `${accountName}`,
      },
      revision: 0,
      version: 1,
      meta: {
        userId: 'ccd65819-4da4-4df9-9f24-5b10bf89ef89',
      },
    }, (err, events, aggregateData) => {
      if (err) {
        log.info(`Error: ${err.name} : ${err.message} : ${err.more}`);
        reject(`Error: "${err.message}"`);
        return;
      }
      log.info(aggregateData);
      const { id, name, status } = aggregateData;
      resolve({ id, name, status });
    });
  });
}

