import { log } from './../../utilities/logging';

function createAccount(req, res, next) {
  log.info('create account');
  res.status(201);
  console.log(req);
  res.json({ message: `Account "${req.body.name}" created` });
  next();
}

export {
  createAccount,
};
