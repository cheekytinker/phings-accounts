import { log } from './../../utilities/logging';

function createAccount(req, res, next) {
  log.info('create account');
  res.status(201);
  console.log(req);
  res.json({ message: `Account "${req.body.name}" created` });
  next();
}

function another(req, res, next) {
  log.info('another');
  res.json({ message: `Account "${req} ${res}"` });
  next();
}
export {
  createAccount,
  another,
};
