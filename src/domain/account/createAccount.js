import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineCommand({
  name: 'createAccount',
  existing: false,
}, (data, aggregate) => {
  log.info(`createAccount agg: ${JSON.stringify(aggregate)}`);
  const theData = data;
  log.info(`Data ${theData}`);
  theData.status = 'created';
  aggregate.apply('accountCreated', theData);
});
