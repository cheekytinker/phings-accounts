import uuidv4 from 'uuid';
import { log } from './../../utilities/logging';
import { domain } from '../../cqrsDomain';

function createAccountSignup(req, res, next) {
  log.info('create account signup');
  domain.handle({
    id: uuidv4(),
    name: 'startAccountSignup',
    aggregate: {
      id: `${req.body.name}`,
      name: 'account',
    },
    payload: {
      name: `${req.body.name}`,
    },
    revision: 0,
    version: 1,
    meta: {
      userId: 'ccd65819-4da4-4df9-9f24-5b10bf89ef89',
    },
  }, (err, events, aggregateData) => {
    log.info(aggregateData);
    res.status(201);
    log.info(req);
    res.json({ message: `Account signup "${req.body.name}" created` });
    next();
  });
}

function another(req, res, next) {
  log.info('another');
  res.json({ message: `Account "${req} ${res}"` });
  next();
}
export {
  createAccountSignup,
  another,
};
