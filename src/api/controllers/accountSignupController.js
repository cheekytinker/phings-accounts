import uuidv4 from 'uuid';
import { log } from './../../utilities/logging';
import { domain } from '../../cqrsDomain';
import cqrsReadDomain from '../../cqrsReadDomain';

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
  }, (err, events, aggregateData, metaInfos) => {
    if (err) {
      log.info(`Error: ${err.name} : ${err.message} : ${err.more}`);
      res.status(400);
      res.json({
        message: `Error "${err.message}"`,
      });
      next();
      return;
    }
    log.info(aggregateData);
    res.status(201);
    log.info(req);
    const { id, name, status } = aggregateData;
    res.json({
      message: `Account signup "${req.body.name}" created`,
      entity: { id, name, status },
      id: metaInfos.aggregateId,
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
  createAccountSignup,
  readAccountSignup,
};
