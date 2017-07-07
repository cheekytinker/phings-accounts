import { log } from './../../utilities/logging';
import cqrsReadDomain from '../../cqrsReadDomain';
import createAccountSignup from '../mutations/createAccountSignup';

function createAccountSignupRest(req, res, next) {
  log.info('create accountSignup signup');
  return createAccountSignup({ input: { name: req.body.name } })
    .then((data) => {
      res.status(201);
      const { name } = data;
      res.json({
        message: `Account signup "${name}" created`,
      });
      next();
    })
    .catch((err) => {
      log.info(`Error: ${err.name} : ${err.message} : ${err.more}`);
      res.status(400);
      res.json({
        message: `Error "${err.message}"`,
      });
      next();
    });
}

function readAccountSignup(req, res, next) {
  log.info('readAccountSignup');
  const rd = cqrsReadDomain.readDomain();
  const accountSignupRepo = rd.repository.extend({
    collectionName: 'accountSignup',
  });

  accountSignupRepo.findOne({ id: req.swagger.params.key.value }, (err, accountSignup) => {
    log.info('got readAccountSignup');
    if (err) {
      log.error(err);
      res.status(500);
      res.json({ error: 'An error occurred' });
      next();
      return;
    }
    if (accountSignup === null) {
      log.info(`Account signup not found ${req.swagger.params.key.value}`);
      res.status(404);
      res.json({ message: 'Account Signup Not found' });
      next();
      return;
    }
    log.info('success readAccountSignup');
    res.status(200);
    const { id: key, name, status } = accountSignup.attributes;
    res.json({ key, name, status });
    next();
  });
}
export {
  createAccountSignupRest,
  readAccountSignup,
};
