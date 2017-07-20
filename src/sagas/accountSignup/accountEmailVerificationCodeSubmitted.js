import sagaDomain from 'cqrs-saga';

module.exports = sagaDomain.defineSaga({
  containingProperties: ['aggregate.id'],
  id: 'aggregate.id',
  existing: true,
}, (evt, saga, callback) => {
  saga.set({
    submittedVerificationCode: evt.payload.verificationCode,
  });
  const cmd = {
    name: 'validateVerificationCode',
    aggregate: {
      name: 'account',
      id: evt.aggregate.id,
    },
    payload: {
      transactionId: saga.id,
      expectedVerificationCode: saga.get('verificationCode'),
      submittedVerificationCode: evt.payload.verificationCode,
    },
    meta: evt.meta, //optional
  };
  saga.addCommandToSend(cmd);
  saga.commit(callback);
});
