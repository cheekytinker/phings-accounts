import denormalizer from 'cqrs-eventdenormalizer';
import { log } from './../../utilities/logging';

module.exports = denormalizer.defineViewBuilder({
// optional, default is file name without extension,
  // if name is '' it will handle all events that matches
  name: 'accountSignupStarted',
  aggregate: 'accountSignup',

  // optional, default is 0
  version: 0,

  // optional, if not defined or not found it will generate a new viewmodel with new id
  id: 'aggregate.id',

  // optional, suppresses auto-creation of new view model if none matching the id can be found, default is true
  autoCreate: true,

  // optional, if not defined it will pass the whole event...
  payload: 'payload',

  // optional, default Infinity, all view-builders will be sorted by this value
  priority: 1,
}, (data, vm) => { // instead of function you can define
  log.info(`ReadDomain AccountSignupStarted ${data}`);
  // a string with default handling ('create', 'update', 'delete')
  // or function that expects a callback (i.e. function (data, vm, callback) {})
// if you have multiple concurrent events that targets the same vm, you can catch it like this:
// during a replay the denormalization finishes and the retry does not happen
  //if (vm.actionOnCommit === 'create') {
    //return this.retry();
    // or
    //return this.retry(100); // retries to denormalize again in 0-100ms
    // or
    //return this.retry({ from: 500, to: 8000 }); // retries to denormalize again in 500-8000ms
  //}
// and if you pass in a callback, then:
//if (vm.actionOnCommit === 'create') {
//  return this.retry(callback);
//  // or
//  //return this.retry(100, callback); // retries to denormalize again in 0-100ms
//  // or
//  //return this.retry({ from: 500, to: 8000 }, callback); // retries to denormalize again in 500-8000ms
//}
  log.info(`ReadDomain AccountSignupStarted creating ${data}`);
  vm.set('name', data.name);
  vm.set('status', data.status);
});
