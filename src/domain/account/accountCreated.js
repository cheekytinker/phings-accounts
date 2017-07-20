import domain from 'cqrs-domain';

module.exports = domain.defineEvent({
  name: 'accountCreated',
}, (data, aggregate) => {
  aggregate.set(data);
});
