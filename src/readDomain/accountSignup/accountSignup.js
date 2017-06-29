import denormalizer from 'cqrs-eventdenormalizer';

module.exports = denormalizer.defineCollection({
  // optional, default is folder name
  name: 'accountSignup',

  // optional, default ''
  defaultPayload: 'payload',
  // indexes: [ // for mongodb
  //   'profileId',
  //   // or:
  //   { profileId: 1 },
  //   // or:
  //   { index: {profileId: 1}, options: {} }
  // ]
});
