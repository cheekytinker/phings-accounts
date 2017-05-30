import domain from 'cqrs-domain';

module.exports = domain.defineEvent({
  name: 'accountSignupStarted',
}, (data, aggregate) => {
  aggregate.set(data);
});
