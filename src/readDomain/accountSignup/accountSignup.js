import denormalizer from 'cqrs-eventdenormalizer';

module.exports = denormalizer.defineCollection({
  name: 'accountSignup',
  defaultPayload: 'payload',
  indexes: [
    'name',
  ],
});
