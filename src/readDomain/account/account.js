import denormalizer from 'cqrs-eventdenormalizer';

module.exports = denormalizer.defineCollection({
  name: 'account',
  defaultPayload: 'payload',
  indexes: [
    'name',
  ],
});
