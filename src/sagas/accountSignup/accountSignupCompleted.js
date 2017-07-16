import sagaDomain from 'cqrs-saga';

module.exports = sagaDomain.defineSaga({
  containingProperties: ['aggregate.id'],
  existing: true,
},(evt, saga, callback) => {
  saga.destroy();
  saga.commit(callback);
});
