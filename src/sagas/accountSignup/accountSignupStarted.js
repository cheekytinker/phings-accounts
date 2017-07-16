import sagaDomain from 'cqrs-saga';

module.exports = sagaDomain.defineSaga({
  containingProperties: ['aggregate.id'],
}, (evt, saga, callback) => {
  saga.set({ accountid: evt.aggregate.id });
  const cmd = {
    name: 'sendAccountVerificationEmail',
    aggregate: {
      name: 'account',
    },
    payload: {
      transactionId: saga.id,
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
