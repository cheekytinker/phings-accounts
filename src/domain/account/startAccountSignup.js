import domain from 'cqrs-domain';
import { log } from '../../utilities/logging';

module.exports = domain.defineCommand({
  name: 'startAccountSignup',
}, (data, aggregate) => {
  const theData = data;
  log.info(`Data ${theData}`);
  theData.status = 'created';
  aggregate.apply('accountSignupStarted', theData);
});
