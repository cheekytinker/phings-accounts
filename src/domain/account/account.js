import domain from 'cqrs-domain';

module.exports = [
  domain.defineAggregate({
    name: 'account',
    defaultCommandPayload: 'payload',
    defaultEventPayload: 'payload',
    defaultPreConditionPayload: 'payload',
  }),
];
