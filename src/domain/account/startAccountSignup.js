import domain from 'cqrs-domain';

module.exports = domain.defineCommand({
  name: 'startAccountSignup',
}, (data, aggregate) => {
  const theData = data;
  theData.status = 'created';
  aggregate.apply('accountSignupStarted', theData);
});
