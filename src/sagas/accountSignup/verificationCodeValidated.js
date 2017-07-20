import sagaDomain from 'cqrs-saga';

module.exports = sagaDomain.defineSaga({
  containingProperties: ['aggregate.id'],
  id: 'aggregate.id',
  existing: true,
}, (evt, saga, callback) => {
  const cmd = {
    name: 'completeAccountSignup',
    aggregate: {
      name: 'account',
      id: evt.aggregate.id,
    },
    payload: {
      transactionId: saga.id,
    },
    meta: evt.meta, //optional
  };
  saga.addCommandToSend(cmd);
  saga.commit(callback);
});
