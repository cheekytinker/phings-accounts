import sagaDomain from 'cqrs-saga';
import { log } from '../../utilities/logging';

module.exports = sagaDomain.defineSaga({
  containingProperties: ['aggregate.id'],
  id: 'aggregate.id',
  existing: true,
}, (evt, saga, callback) => {
  log.info(`destroying saga ${JSON.stringify(saga)}`);
  saga.destroy();
  saga.commit(callback);
});
