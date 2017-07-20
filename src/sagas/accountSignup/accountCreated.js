import shortid from 'shortid';
import sagaDomain from 'cqrs-saga';
import { log } from '../../utilities/logging';

module.exports = sagaDomain.defineSaga({
  containingProperties: ['aggregate.id'],
  id: 'aggregate.id',
  existing: false,
}, (evt, saga, callback) => {
  log.info('account created saga');
  const verificationCode = shortid.generate();
  saga.set({
    accountId: evt.aggregate.id,
    verificationCode,
  });
  const cmd = {
    name: 'sendAccountVerificationEmail',
    aggregate: {
      name: 'account',
      id: evt.aggregate.id,
    },
    payload: {
      transactionId: saga.id,
      verificationCode,
    },
    meta: evt.meta, //optional
  };
  saga.addCommandToSend(cmd);
  const timeoutCmd = {
    name: 'cancelAccountSignup',
    aggregate: {
      name: 'account',
      id: evt.aggregate.id,
    },
    payload: {
      transactionId: saga.id,
    },
    meta: evt.meta,
  };
  const tomorrow = new Date();
  tomorrow.setDate((new Date()).getDate() + 1);
  saga.defineTimeout(tomorrow, timeoutCmd);
  saga.commit(callback);
});
