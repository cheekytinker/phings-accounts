import denormalizer from 'cqrs-eventdenormalizer';

module.exports = denormalizer.defineViewBuilder({
  name: '',
  aggregate: 'account',
  version: 0,
  id: 'aggregate.id',
  autoCreate: true,
  payload: 'payload',
  priority: 1,
}, 'update');
